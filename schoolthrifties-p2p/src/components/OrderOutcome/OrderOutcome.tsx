import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import useApi from "../../hooks/useApi";
import {  useEffect, useState } from "react";
import { useUserStore } from '../../stores/useUserStore';
import { Link, useNavigate } from "react-router-dom";
import { statusesMessages, Statuses } from "./StaticData";
import useToastStore from "../../stores/useToastStore";
interface OrderProps {
    buyerName: string;
    items: Array<{ title: string, description: string, price: string }>;
    totalAmount: string;
}

interface OrderItemProps {
    product: {
        title: string;
        description: string;
        price: string;
    }
}

const OrderOutcome = () => {
    const [orderDetails, setOrderDetails] = useState<OrderProps>({} as OrderProps);
    const { get, post, loading } = useApi(`${import.meta.env.VITE_API_URL}`);
    const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);
    const urlObj = new URL(window.location.href);
    const params = new URLSearchParams(urlObj.search);
    const orderId = params.get('Optional1');
    const orderStatus = params.get('Status');
    const navigate = useNavigate();
    const { showToast } = useToastStore();

    useEffect(() => {
        if (!orderId) navigate('/home');
        const fetchOrderDetails = async () => {

            const order = await get(`/orders/fetch-orders?order_id=${orderId}`);
            try {
                if (!order) throw new Error('Order not found');

                const [orderObject] = order;
                const { delivery_cost, total_price, items, shipping_method } = orderObject;

                const data = {
                    buyerName: `${user.first_name} ${user.last_name}`,
                    items: items.map(({ product: { title, price, description } }: OrderItemProps) => {
                        return { title, description, price };
                    }),
                    totalAmount: total_price,
                }
                data.items.push({
                    title: 'Shipping Option',
                    description: shipping_method,
                    price: delivery_cost
                });
                setOrderDetails(data);
            } catch (error) {
                const _error = error instanceof Error ? error.message : error;
                showToast(_error as string, 'error');
                console.error('error', _error);
                return;
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const payExistingOrder = async () => {
        try {
            const orderToPay = await post(`/orders/pay-existing-ozow-order`, { order_id: orderId, user_id: user.user_id });

            if (!orderToPay) throw new Error('Error opening payment gateway');

            if (orderToPay.url) {
                window.open(orderToPay.url, '_self');
                return;
            }

            showToast('Order paid successfully', 'success');
            navigate('/orders');

        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    };

    return (
        <>
            {
                loading
                    ? <Typography>Loading...</Typography>
                    :
                    <Box
                        sx={{
                            maxWidth: 600,
                            margin: "20px auto",
                            padding: "20px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 1, color: statusesMessages[orderStatus as keyof typeof statusesMessages]?.color }}>
                            {Statuses[orderStatus as keyof typeof Statuses]}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {statusesMessages[orderStatus as keyof typeof statusesMessages]?.message} {orderStatus == 'Success' && orderDetails.buyerName}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {statusesMessages[orderStatus as keyof typeof statusesMessages]?.paragraph}
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Item</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell><strong>Price</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetails?.items?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>R{item.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" sx={{ mt: 3 }}>
                            Total Amount: <strong>R{orderDetails?.totalAmount}</strong>
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={2}>
                            {
                                orderStatus !== 'Complete' && <Button
                                    variant="contained"
                                    sx={{ mt: 3, backgroundColor: "limegreen" }}
                                    onClick={payExistingOrder}
                                >
                                    Pay now
                                </Button>
                            }
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3 }}
                            >
                                <Link to="/orders"
                                    style={{ color: "white", textDecoration: "none" }}
                                >
                                    View Your Orders
                                </Link>
                            </Button>
                        </Box>
                    </Box>
            }
        </>
    );
};

export default OrderOutcome;
