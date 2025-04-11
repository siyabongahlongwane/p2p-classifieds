import React, {  useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Pagination,
    TableFooter,
} from "@mui/material";
import { OrderPreview } from "../../typings/Order.int";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { useUserStore } from '../../stores/useUserStore';

const OrdersList = ({ orders, showPayNow }: { orders: OrderPreview[], showPayNow: boolean }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const filteredOrders = orders.filter(
        (order) =>
            order.buyerName.toLowerCase().includes(search.toLowerCase()) ||
            order.order_id.toString().includes(search)
    );

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const { post } = useApi(`${import.meta.env.VITE_API_URL}`);
    const { showToast } = useToastStore();
    const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);

    const payExistingOrder = async (order_id: number) => {
        try {
            const orderToPay = await post(`/orders/pay-existing-ozow-order`, { order_id, user_id: user.user_id });

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
        <Box>
            {/* Search Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <TextField
                    placeholder="Search By ID or Buyer Name"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: "320px" }}
                />
            </Box>

            {/* Orders Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Order #</strong></TableCell>
                            <TableCell><strong>Buyer</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Total</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.slice((page - 1) * 5, page * 5).map((order) => (
                            <TableRow key={order.order_id}>
                                <TableCell>{order.order_id}</TableCell>
                                <TableCell>{order.buyerName}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>R{order.totalAmount}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    <Button onClick={() => navigate(`../view-order/${order.order_id}`)} size="small" variant="outlined" color="primary" sx={{ mr: 1 }}>
                                        View
                                    </Button>
                                    {
                                        (showPayNow && order?.status.includes('Pending') && order.user_id != user?.user_id) ?
                                            <Button onClick={() => payExistingOrder(+order.order_id)} size="small" variant="contained" color="success">
                                                Pay Now {order?.isPaid}
                                            </Button>
                                            : null
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Pagination
                                    count={Math.ceil(filteredOrders.length / 5)}
                                    page={page}
                                    onChange={handlePageChange}
                                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrdersList;
