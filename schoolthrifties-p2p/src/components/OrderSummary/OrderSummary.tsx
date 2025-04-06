import {
    Button, Divider, Paper, Stack, Typography,
} from "@mui/material";
import { useStore } from "../../stores/store";
import { useCallback, useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { User } from "../../typings";
import useToastStore from "../../stores/useToastStore";
import PaymentOptions from "./PaymentOptions";
import TransactionFeeInfo from "./TransactionFeeInfo";
import OrderRow from "./OrderRow";

const OrderSummary = ({ user }: { user: User }) => {
    const { cart, orderObject, setField } = useStore();
    const { showToast } = useToastStore();
    const [walletBalance, setWalletBalance] = useState(0);
    const [disableWallet, setDisableWallet] = useState(false);
    const [transactionFee, setTransactionFee] = useState('0.00');
    const [selectedPayment, setSelectedPayment] = useState('');

    const { post, get } = useApi(`${import.meta.env.VITE_API_URL}`);
    const { shippingMethod, deliveryCost, cartTotal } = orderObject;

    const getWalletBalance = useCallback(async () => {
        try {
            const wallet = await get(`/wallet/fetch-wallet?user_id=${user?.user_id}`);
            if (!wallet) throw new Error('Error fetching wallet');
            setWalletBalance(wallet.amount);
            if (+wallet.amount === 0) setDisableWallet(true);
            const total = cartTotal + deliveryCost;
            if (+wallet.amount >= total) {
                setSelectedPayment('wallet');
                setDisableWallet(true);
            }
        } catch (error) {
            setDisableWallet(true);
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
        }
    }, [get, user?.user_id, showToast, cartTotal, deliveryCost]);

    useEffect(() => {
        const cartTotal = +(cart.reduce((acc, curr) => +acc + (+curr.price), 0).toFixed(2)); // Calculate Cart Total
        const total = +(cartTotal + +orderObject.deliveryCost + +transactionFee).toFixed(2); // Calculate Total Cost

        setField('orderObject', { ...orderObject, cart, cartTotal, total });

        getWalletBalance();
        getTransactionFee(cartTotal);
    }, [cart, orderObject.deliveryCost, transactionFee]);

    const getTransactionFee = (cartTotal: number) => {
        const total = cartTotal + deliveryCost;
        if (walletBalance === 0 || walletBalance < total) {
            const fee = (+import.meta.env.VITE_TRANSACTION_FEE * 0.01 * (total - walletBalance)).toFixed(2);
            setTransactionFee(fee);
        }
    };

    const getEndpoint = (walletBalance: number, total: number): string => {
        if (walletBalance === 0) return '/orders/create-order';
        if (walletBalance >= total) return '/orders/create-order?paymentOption=walletFull';
        return `/orders/create-order?paymentOption=walletPartial&gateway=${selectedPayment}`;
    };

    const payNow = async () => {
        try {
            if (!orderObject.shippingMethod) {
                showToast('Please select shipping method (In Shipping Details)', 'warning');
                return;
            }
            
            if (!selectedPayment) {
                showToast('Please select Payment Method (In Payment Screen)', 'warning');
                return;
            }

            const endpoint = getEndpoint(+walletBalance, orderObject.total);
            const customerDetails = { firstName: user.first_name, lastName: user.last_name };

            const res = await post(endpoint, {
                ...orderObject,
                user_id: user.user_id,
                customerDetails,
            });

            if (!res?.url) throw new Error(`Error creating order: ${res?.errorMessage || 'Could not open payment gateway'}`);
            window.open(res.url, '_self');
        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
        }
    };

    const payable = Math.max((cartTotal + deliveryCost - walletBalance + +transactionFee), 0);

    return (
        <Paper>
            <Stack p={3} gap={2}>
                <Typography variant="h6" fontWeight={500}>Your Order</Typography>
                <Divider />
                <OrderRow label={`Subtotal (${cart.length} item${cart.length > 1 ? 's' : ''})`} value={`R${cartTotal}`} />
                <OrderRow label="Shipping Option" value={shippingMethod ?? '-'} />
                <Typography fontSize={14} fontWeight={500} color="gray">Pay with</Typography>

                <PaymentOptions
                    selected={selectedPayment}
                    onChange={setSelectedPayment}
                    walletBalance={walletBalance}
                    disableWallet={disableWallet}
                />

                <OrderRow
                    label="Payment Method"
                    value={`${selectedPayment?.toUpperCase()}${walletBalance > 0 && walletBalance < cartTotal + deliveryCost ? ' and WALLET' : ''}`}
                />

                <OrderRow label="Shipping Fee" value={`R${deliveryCost ?? '-'}`} />
                <OrderRow label="Wallet Funds" value={`R${walletBalance}`} />

                {cartTotal > walletBalance && (
                    <TransactionFeeInfo fee={transactionFee} />
                )}

                <OrderRow label="Total Payable" value={`R${payable.toFixed(2)}`} bold />

                <Button onClick={payNow} color="primary" variant="contained">Pay now</Button>
            </Stack>
        </Paper>
    );
};

export default OrderSummary;
