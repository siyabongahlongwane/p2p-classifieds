import { Box, Button, Divider, Paper, Stack, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";

import { useStore } from "../../stores/store";
import { useCallback, useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { User } from "../../typings";
import useToastStore from "../../stores/useToastStore";
interface PaymentOption {
    value: string;
    label: string;
}


const OrderSummary = ({ user }: { user: User }) => {
    const { cart, orderObject, setField } = useStore();
    const { showToast } = useToastStore();
    const [walletBalance, setWalletBalance] = useState(0);
    const [disableWallet, setDisableWallet] = useState(false);

    const { post, get } = useApi(`${import.meta.env.VITE_API_URL}`);

    const { shippingMethod, deliveryCost, cartTotal } = orderObject;

    const getWalletBalance = useCallback(async () => {
        try {
            const wallet = await get(`/wallet/fetch-wallet?user_id=${user?.user_id}`);
            if (!wallet) throw new Error('Error fetching wallet');
            setWalletBalance(wallet.amount);
            console.log(+wallet.amount)
            if (+wallet.amount == 0) setDisableWallet(true);
            if (+walletBalance === (cartTotal + deliveryCost) || +walletBalance > (cartTotal + deliveryCost)) {
                setSelectedPayment('wallet');
                setDisableWallet(true);
            }
        } catch (error) {
            setDisableWallet(true);
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    }, [get, user?.user_id, showToast, walletBalance]);

    const [selectedPayment, setSelectedPayment] = useState('');

    const paymentOptions: PaymentOption[] = [
        { value: 'Ozow', label: 'Ozow' },
    ];

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPayment(event.target.value);
    };

    useEffect(() => {
        const cartTotal = +(cart.reduce((acc, curr) => +acc + (+curr.price), 0).toFixed(2));
        const total = +(cartTotal + (+orderObject.deliveryCost)).toFixed(2);

        setField('orderObject', { ...orderObject, cart, cartTotal, total });
        getWalletBalance();
    }, [cart, orderObject.deliveryCost, walletBalance])

    const getEndpoint = (walletBalance: number, total: number): string => {
        if (walletBalance === 0) {
            return '/orders/create-order';
        }

        if (walletBalance === total) {
            setSelectedPayment('wallet');
            setDisableWallet(true);
            return '/orders/create-order?paymentOption=walletFull';
        }

        if (walletBalance > total) {
            setSelectedPayment('wallet');
            setDisableWallet(true);
            return '/orders/create-order?paymentOption=walletExcess';
        }

        if (walletBalance < total) {

            return `/orders/create-order?paymentOption=walletPartial&gateway=${selectedPayment}`;
        }

        return '/orders/create-order';
    };

    const payNow = async () => {
        try {
            if (!orderObject.shippingMethod) {
                showToast('Please select shipping method (In Shipping Details)', 'warning');
                return;
            }

            const total = cartTotal + deliveryCost;
            const endpoint = getEndpoint(+walletBalance, total);
            const customerDetails = { firstName: user.first_name, lastName: user.last_name };

            console.log(user);

            console.log('orderObject', {
                ...orderObject,
                phoneNumber: user.phone,
                user_id: user.user_id,
                customerDetails
            }, endpoint);

            const res = await post(endpoint, {
                ...orderObject,
                user_id: user.user_id,
                customerDetails
            });

            if (!res?.url) {
                throw new Error(`Error creating order: ${res?.errorMessage || 'Could not open payment gateway'}`);
            }

            window.open(res.url, '_self');
        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
        }
    };

    return (
        <Paper >
            <Stack p={3} gap={2}>
                <Typography variant="h6" fontWeight={500}>Your Order</Typography>
                <Divider />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography
                        fontSize={14}
                        variant="body2"
                        fontWeight={400}
                        color="gray"
                    >
                        Subtotal ({cart.length} {cart.length > 1 ? 'items' : 'item'})
                    </Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">R{cartTotal}</Typography>
                </Box>
                <Divider />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Shipping Option</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="500">{shippingMethod ?? '-'}</Typography>
                </Box>
                <Divider />
                <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">Pay with</Typography>
                <FormControl component="fieldset">
                    <RadioGroup
                        value={selectedPayment}
                        onChange={handlePaymentChange}
                    >
                        {paymentOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                            />
                        ))}
                        {+walletBalance > 0 && (
                            <FormControlLabel
                                value="wallet"
                                control={<Radio />}
                                label={`Wallet (R${walletBalance})`}
                                disabled={disableWallet}
                            />
                        )}
                    </RadioGroup>
                </FormControl>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Payment Method</Typography>
                    <Typography
                        fontSize={12}
                        variant="body2"
                        fontWeight={400}
                        color="gray"
                    >
                        {selectedPayment?.toUpperCase()}
                        {walletBalance > 0 && (walletBalance < cartTotal + deliveryCost) && selectedPayment && ' and WALLET'}
                    </Typography>
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
                    <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">
                        R{Math.max((cartTotal + deliveryCost - walletBalance), 0)}
                    </Typography>
                </Box>
                <Button onClick={() => payNow()} color="primary" variant="contained">Pay now</Button>
            </Stack>
        </Paper>
    )
}

export default OrderSummary;