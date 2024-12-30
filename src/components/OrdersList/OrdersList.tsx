import React, { useState } from "react";
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

const OrdersList = ({ orders, showEdit }: { orders: OrderPreview[], showEdit: boolean }) => {
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
                                        showEdit &&
                                        <Button size="small" variant="outlined" color="warning">
                                            Edit
                                        </Button>
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
