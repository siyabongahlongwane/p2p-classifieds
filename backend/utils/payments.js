const { logger } = require("firebase-functions/v1");
const crypto = require("crypto");
const axios = require("axios");
const logAndSendError = (res, err, status) => {
    logger.error(err, { date: Date.now() });
    res.status(status).send({ err, success: false });
}

const customError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
}


const generateRequestHash = async (order, orderNumber) => {
    const paymentObject = {
        SiteCode: process.env.SITE_CODE,
        CountryCode: 'ZA',
        CurrencyCode: 'ZAR',
        Amount: order.orderTotal ? +order.orderTotal.toFixed(2) : +order.total_price.toFixed(2),
        TransactionReference: `School Thrifites Order ${orderNumber}`,
        BankReference: `Order ${orderNumber}`,
        Optional1: order?.uid || +orderNumber,
        Customer: `${order?.customerDetails?.firstName} ${order?.customerDetails?.lastName}`,
        CancelUrl: process.env.CLIENT_URL + `/orders/canceled-order`,
        ErrorUrl: process.env.CLIENT_URL + `/orders/failed-order`,
        SuccessUrl: process.env.CLIENT_URL + `/orders/thank-you`,
        NotifyUrl: process.env.SERVER_URL + `/classifieds/payments/ozow/notify`,
        IsTest: true
    };

    const { SiteCode, CountryCode, CurrencyCode, Amount, TransactionReference, BankReference, Optional1, Customer, CancelUrl, ErrorUrl, SuccessUrl, NotifyUrl, IsTest } = paymentObject;

    const inputString = `${SiteCode}${CountryCode}${CurrencyCode}${Amount}${TransactionReference}${BankReference}${Optional1}${Customer}${CancelUrl}${ErrorUrl}${SuccessUrl}${NotifyUrl}${IsTest}${process.env.OZOW_PRIVATE_KEY}`;

    const calculatedHashResult = generateRequestHashCheck(inputString);
    paymentObject['HashCheck'] = calculatedHashResult;
    return paymentObject;
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

const transformOrderNumber = (currentOrderNumber) => {
    let newOrderNumber = (currentOrderNumber) + 1;
    if (newOrderNumber < 10) {
        newOrderNumber = "0000" + newOrderNumber;
    }
    else if (newOrderNumber < 100) {
        newOrderNumber = "000" + newOrderNumber;
    }
    else if (newOrderNumber < 1000) {
        newOrderNumber = "00" + newOrderNumber;
    }
    else if (newOrderNumber < 10000) {
        newOrderNumber = "0" + newOrderNumber;
    }
    return newOrderNumber;
}

function formatDateToISO() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timezoneOffset = -date.getTimezoneOffset();
    const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, '0');
    const timezoneMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
    const timezoneSign = timezoneOffset >= 0 ? '+' : '-';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneSign}${timezoneHours}:${timezoneMinutes}`;
}

const getPeachToken = async () => {
    const baseUrl = process.env.GET_TOKEN_URL;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json"
    }

    const requestBody = {
        "clientId": process.env.CLIENT_ID,
        "clientSecret": process.env.CLIENT_SECRET,
        "merchantId": process.env.MERCHANT_ID
    }

    const tokenData = await axios.post(baseUrl, requestBody, { headers });
    try {
        if (!tokenData?.['data']?.['access_token']) throw customError('Error generating access token', 401)
        return { success: true, access_token: tokenData['data']['access_token'] };
    } catch ({ message, status }) {
        return { res, message, status }
    }
}

module.exports = {
    logAndSendError,
    customError,
    transformOrderNumber,
    generateRequestHash,
    formatDateToISO,
    getPeachToken
}