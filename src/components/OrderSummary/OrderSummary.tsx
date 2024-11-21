import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useStore } from "../../stores/store";
import { useEffect } from "react";

const OrderSummary = () => {
    const { cart, orderObject, setField } = useStore();
    const itemsCount = cart.length > 1 ? `${cart.length} items` : `${cart.length} item`;

    useEffect(() => {
        const cartTotal = +(cart.reduce((acc, curr) => +acc + (+curr.price), 0).toFixed(2));
        const total = +(cartTotal + (+orderObject.deliveryCost)).toFixed(2)

        setField('orderObject', { ...orderObject, cartTotal, total });
    }, [cart, orderObject.deliveryCost])

    const { total, shippingMethod, deliveryCost, cartTotal, paymentOption } = orderObject;

    return (
        <Paper >
            <Stack p={3} gap={2}>
                <Typography variant="h6" fontWeight={500}>Your Order</Typography>
                <Divider />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Subtotal ({itemsCount})</Typography>
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
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Total Payable</Typography>
                    <Typography fontSize={14} variant="body2" fontWeight={500} color="gray">R{total}</Typography>
                </Box>
                <Button color="primary" variant="contained">Pay now</Button>
            </Stack>
        </Paper>
    )
}

export default OrderSummary;