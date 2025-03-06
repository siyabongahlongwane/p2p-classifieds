import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useStore } from "../../stores/store";
import { useCallback, useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { User } from "../../typings";
import useToastStore from "../../stores/useToastStore";

const OrderSummary = ({ user }: { user: User }) => {
    const { cart, orderObject, setField } = useStore();
    const { showToast } = useToastStore();
    const [walletBalance, setWalletBalance] = useState(0);

    const { post, get } = useApi(`${import.meta.env.VITE_API_URL}`);

    const { shippingMethod, deliveryCost, cartTotal, paymentOption } = orderObject;

    const getWalletBalance = useCallback(async () => {
        try {
            const wallet = await get(`/wallet/fetch-wallet?user_id=${user?.user_id}`);
            if (!wallet) throw new Error('Error fetching wallet');
            setWalletBalance(wallet.amount);
        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    }, [get, user?.user_id, showToast]);

    useEffect(() => {
        const cartTotal = +(cart.reduce((acc, curr) => +acc + (+curr.price), 0).toFixed(2));
        const total = +(cartTotal + (+orderObject.deliveryCost)).toFixed(2) - walletBalance;

        setField('orderObject', { ...orderObject, cart, cartTotal, total });
        getWalletBalance();
    }, [cart, orderObject.deliveryCost, walletBalance])

    const payNow = async () => {
        try {
            setField('orderObject', { ...orderObject, user_id: user.user_id });
            if (!orderObject.shippingMethod) {
                showToast('Please select shipping method (In Shipping Details)', 'warning');
                return;
            }
            const customerDetails = { firstName: user.first_name, lastName: user.last_name };
            const endPoint = walletBalance > 0 ? '/orders/create-order?useWallet=true' : '/orders/create-order';

            const res = await post(endPoint, { ...orderObject, user_id: user.user_id, customerDetails });
            if (!res?.url) throw new Error(`Error creating order: ${res?.errorMessage || 'Could not open payment gateway'}`);
            window.open(res.url, '_self');
        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    }

    return (
        <Paper >
            <Stack p={3} gap={2}>
                <Typography variant="h6" fontWeight={500}>Your Order</Typography>
                <Divider />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Subtotal ({cart.length > 1 ? `${cart.length} items` : `${cart.length} item`})</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">R{cartTotal}</Typography>
                </Box>
                <Divider />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Shipping Option</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="500">{shippingMethod ?? '-'}</Typography>
                </Box>
                <Divider />
                <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">Pay with</Typography>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Payment Method</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="500">{paymentOption}</Typography>
                </Box>

                <Divider />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Shipping Fee</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">R{deliveryCost ?? '-'}</Typography>
                </Box>
                <Divider />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Wallet Funds</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">R{walletBalance}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Total Payable</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">R{(orderObject.cartTotal + orderObject.deliveryCost - walletBalance) > 0 ? (orderObject.cartTotal + orderObject.deliveryCost - walletBalance) : 0}</Typography>
                </Box>
                <Button onClick={() => payNow()} color="primary" variant="contained">Pay now</Button>
            </Stack>
        </Paper>
    )
}

export default OrderSummary;