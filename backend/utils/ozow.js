//this file contains all the functions that interact with firestore, adding, removing, updating data
const admin = require("firebase-admin");
const express = require('express');
const paymentsRouter = express.Router();
const { fetchData, updateData, updateBulkData } = require("../src/utils/dbFunctions");
const { logger } = require("firebase-functions/v1");
const { db } = require("../src/config/config");
const sendMail = require("../src/utils/sendMail");
const { logAndSendError, customError } = require("./payments");
const { successfulCustomerOrder, successfulAdminOrder } = require("../src/utils/emailTemplates");
const ordersRef = db.collection("orders");
const productsRef = db.collection("products");
const cartRef = db.collection("cart");
const refundsRef = db.collection("refunds");
const walletRef = db.collection("wallet");
const axios = require('axios').default;
const crypto = require("crypto");
const parentAuthenticateToken = require("../src/middleware/parentAuthMiddleware");

const notify = async (req, res) => {
    const data = req.body;
    logger.info('Post Pay Screen', data);
    if (data?.['Status'] == 'Complete') {
        const [order] = await fetchData('uid', data?.['Optional1'], ordersRef);

        if (!order) throw customError('Error fetching order', 400);
        else {
            const updateBody = {
                isPaid: true,
                datePaid: Date.now(),
                transactionId: data?.TransactionId
            }

            await updateBulkData('uid', 'in', [...order.products], productsRef, { isAvailable: false });

            const cartItemBody = {
                "cart": [],
                "owner": order?.owner
            }

            await cartRef.where('owner', '==', order?.owner).get().then(querySnapshot => {
                querySnapshot.forEach(async (snapshot) => {
                    snapshot.data().id
                    await updateData(snapshot.id, { ...cartItemBody }, cartRef);
                })
            })
            const updatedData = await updateData(data?.['Optional1'], { ...updateBody }, ordersRef);

            try {
                if (!updatedData) throw new Error('Error updating order');

                const emailBody = successfulCustomerOrder(order?.customerDetails?.firstName, order.orderNumber, order?.products[0]?.branchEmail);

                const schoolEmailBody = successfulAdminOrder(order.orderNumber);

                await sendMail(process.env.COMMUNICATIONS_EMAIL, order?.customerDetails?.email, `Your order #${order.orderNumber} with School Thrifties`, emailBody);
                await sendMail(process.env.COMMUNICATIONS_EMAIL, order?.products[0]?.branchEmail, `Order #${order.orderNumber}`, schoolEmailBody);
                res.send("Complete");
            } catch ({ message, status = 400 }) {
                logAndSendError(res, message, 400);
            }

        }
    }
}

const notifyRefund = async (req, res) => {
    const data = req.body;
    logger.info('Refund response', data);
    const similarStatuses = ['Returned', 'Cancelled', 'Failed'];
    const [refund] = await fetchData('transactionId', data?.['TransactionId'], refundsRef);

    if (!refund) throw new Error('Error fetching order');

    if (data?.['Status'] == 'Complete') {

        const updateBody = {
            isRefunded: true,
            orderNumber: refund['orderNumber'],
            owner: refund['owner'],
            paymentMethod: refund['paymentMethod'],
            reason: refund['reason'],
            refundDate: new Date().getTime(),
            refundRequested: true,
            refundTotal: refund['refundTotal'],
            requestDate: refund['requestDate'],
            status: 'Refunded',
            transactionId: refund['transactionId'],
        }

        // Add functionality to update schools total amount after refund
        await updateData(refund['uid'], { ...updateBody }, refundsRef);

        try {
            if (!updatedData) throw new Error('Error updating refund');
            res.send("Complete");
        } catch ({ message }) {
            logAndSendError(res, message, 400);
        }
    }

    else if (similarStatuses.includes(data?.['Status'])) {
        const updateBody = {
            isRefunded: false,
            orderNumber: refund['orderNumber'],
            owner: refund['owner'],
            paymentMethod: refund['paymentMethod'],
            reason: refund['reason'],
            refundDate: null,
            refundRequested: true,
            refundTotal: refund['refundTotal'],
            requestDate: refund['requestDate'],
            refundFailedDate: new Date().getTime(),
            status: data?.['Status'] ?? 'Failed',
            transactionId: refund['transactionId'],
        }

        // Add functionality to update schools total amount after refund
        await updateData(refund['uid'], { ...updateBody }, refundsRef);

        try {
            if (!updatedData) throw new Error('Error updating refund');

            const emailBody = 'The refund for order #' + refund['orderNumber'] + ' has failed, please login and process manually';
            await sendMail(process.env.COMMUNICATIONS_EMAIL, 'support@schoolthrifties.co.za', `Failed Refund - #${refund['orderNumber']}`, emailBody);
            res.send("Complete");
        } catch ({ message }) {
            logAndSendError(res, message, 400);
        }
    }
    res.send("Complete")
}

const getToken = async (req, res) => {
    const baseUrl = "https://api.ozow.com/token";
    const headers = {
        ApiKey: process.env.OZOW_API_KEY,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    const requestBody = {
        grant_type: "password",
        SiteCode: process.env.SITE_CODE
    }

    const tokenData = await axios.post(baseUrl, requestBody, { headers });

    try {
        if (!tokenData?.['data']?.['access_token']) throw customError('Error generating refund token', 400)
        res.send({ success: true, tokenData: tokenData['data'] })
    } catch ({ message, status }) {
        logAndSendError(res, message, status);
    }
}

const getRefunds = async (req, res) => {
    const { owner } = req.body;
    let refunds = (await fetchData('owner', owner, refundsRef));
    try {
        res.send({ success: true, refunds: refunds?.sort((a, b) => Number(b?.orderNumber) - Number(a?.orderNumber)) })
    } catch ({ message }) {
        logAndSendError(res, message, 400);
    }
}

const requestRefund = async (req, res) => {
    const { body } = req;
    const [dbRefund] = await fetchData('uid', body?.uid, refundsRef);
    const { refundRequested, isRefunded } = dbRefund;

    try {
        if (!dbRefund) {
            throw customError(`Refund not found`, 400)
        }

        else if (refundRequested || isRefunded) {
            throw customError(`Order refund has already been processed`, 400);
        }

        const [wallet] = await fetchData('owner', dbRefund?.owner, walletRef);

        if (!wallet || wallet?.credit < dbRefund.refundTotal) {
            throw customError('Insufficient Wallet Credit', 400);
        }

        const tokenRequest = await axios.get(`${process.env.SERVER_URL}/payments/ozow/get-token`, { headers: { "Authorization": `${req?.headers?.authorization}` } });
        if (!tokenRequest?.['data']?.['tokenData']) throw customError('Error generating refund token', 400);
        const { access_token } = tokenRequest?.['data']?.['tokenData'];
        const ozowRefundBody = [await generateRequestHash(dbRefund)];

        const headers = {
            "Authorization": `Bearer ${access_token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

        let refund = await axios.post(`https://api.ozow.com/secure/refunds/submit`, ozowRefundBody, { headers });
        const data = refund?.data?.[0];
        const { errors } = data;

        if (!data?.refundId) throw customError(errors?.join(",") ?? 'There was an error processing the refund', 400);
        updateRefund(dbRefund);

        res.send({ success: true, msg: "Refund confirmed! Refund to be processed in 3 to 5 working days" });

    } catch ({ message, status = 400 }) {
        logAndSendError(res, message, status);
    }
}

const generateRequestHash = async (refund) => {
    const refundRequest = {
        TransactionId: refund?.transactionId,
        Amount: refund?.refundTotal,
        RefundReason: refund?.reason,
        NotifyUrl: process.env.SERVER_URL + '/payments/ozow/notify-refund',
    };

    const { TransactionId, Amount, RefundReason, NotifyUrl } = refundRequest;

    const inputString = `${TransactionId}${Amount}${RefundReason}${NotifyUrl}`;

    const calculatedHashResult = generateRequestHashCheck(inputString);
    refundRequest['HashCheck'] = calculatedHashResult;
    return refundRequest;
}

const generateRequestHashCheck = (inputString) => {
    const stringToHash = inputString.toLowerCase();
    return getSha512Hash(stringToHash);
}

const getSha512Hash = (stringToHash) => {
    const hash = crypto.createHash("sha512");
    hash.update(stringToHash);
    return hash.digest("hex");
}

const getRefundStatus = async (req, res) => {
    const tokenRequest = await axios.get(`${process.env.SERVER_URL}/payments/ozow/get-token`, { headers: { "Authorization": `${req?.headers?.authorization}` } });
    try {
        if (!tokenRequest?.['data']?.['tokenData']) throw customError('Error generating refund token', 400);
        const { access_token } = tokenRequest?.['data']?.['tokenData'];

        const headers = {
            "Authorization": `Bearer ${access_token}`,
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "SiteCode": process.env.SITE_CODE,
            "ApiKey": process.env.OZOW_API_KEY
        }

        const { TransactionId } = req?.body;
        const params = { TransactionId }

        let refunds = await axios.get(`https://api.ozow.com/secure/refunds/getrefundsbytransactionid`, { params, headers });

        const data = refunds?.data?.[0];
        const { errors } = data;
        if (!data?.id) throw customError(errors?.join(",") ?? 'There was an error getting the refund status', 400);
        await

            res.send({ success: true, refunds: refunds['data'] });

    } catch ({ message, status = 400 }) {
        logAndSendError(res, message, status);
    }
}

const updateRefund = async (dbRefund) => {
    Object.assign(dbRefund, {
        requestDate: Date.now(),
        status: 'Initiated',
        refundRequested: true
    });
    const { uid, owner } = dbRefund;
    await updateData(uid, { ...dbRefund }, refundsRef);

    const [wallet] = await fetchData('owner', owner, walletRef);
    if (wallet) {
        const { uid } = wallet;
        const credit = (wallet['credit'] - +dbRefund['refundTotal']).toFixed(2);
        Object.assign(wallet, { credit });
        await updateData(uid, { ...wallet }, walletRef);
    }
}

paymentsRouter.post('/ozow/notify', notify);
paymentsRouter.post('/ozow/notify-refund', notifyRefund);
paymentsRouter.get('/ozow/get-token', parentAuthenticateToken, getToken);
paymentsRouter.post('/ozow/fetch-refunds', parentAuthenticateToken, getRefunds);
paymentsRouter.post('/ozow/request-refund', parentAuthenticateToken, requestRefund);
paymentsRouter.post('/ozow/get-refund-status', parentAuthenticateToken, getRefundStatus);

module.exports = paymentsRouter;