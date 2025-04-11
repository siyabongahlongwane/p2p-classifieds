import {  useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  // Rating,
  Grid2
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { OrderWithItems } from "../../typings/Order.int";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useUserStore } from '../../stores/useUserStore';
import useToastStore from "../../stores/useToastStore";

const ViewOrder = () => {
  const { get, loading, post } = useApi(`${import.meta.env.VITE_API_URL}`);
  const [order, setOrder] = useState<OrderWithItems>({} as OrderWithItems);
  const navigate = useNavigate();
  // const [rating, setRating] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const { order_id } = useParams();
  const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);
  const [isOwner, setIsOwner] = useState(false);
  const { showToast } = useToastStore();

  const handleConfirmReceipt = async () => {
    setIsConfirmed(true);

    try {
      const { order_id, shop_id } = order;
      const updatedOrder = await post(`/orders/update-seller-order-status`, { order_id, shop_id });
      if (!updatedOrder) throw new Error('Error confirming receipt');

      setOrder(updatedOrder);
      showToast('Receipt confirmed successfully', 'success');

    } catch (error) {
      const _error = error instanceof Error ? error.message : error;
      showToast(_error as string, 'error');
      console.error('error', _error);
      return;
    }
  };

  const handleCancelOrder = async () => {
    setIsCancelled(true);

    try {
      const { order_id } = order;
      const { first_name: updatedBy } = user;
      const updatedOrder = await post(`/orders/update-customer-order-status`, { order_id, updatedBy, status: 'Cancelled' });
      setOrder(updatedOrder);
      setIsCancelled(updatedOrder.status === 'Cancelled')
      showToast('Order cancelled successfully', 'success');

    } catch (error) {
      showToast('Error cancelling order', 'error');
      console.error("Error confirming order receipt:", error);
    }
  };

  // const handleRating = (newRating: number | null) => {
  //   setRating(newRating);
  //   console.log("Rated order:", { orderId: order.order_id, rating: newRating });
  // };

  useEffect(() => {
    if (!order_id) navigate('/orders/my-orders');
    const fetchOrder = async () => {
      try {
        const [order] = await get(`/orders/fetch-orders?order_id=${order_id}`);
        setIsOwner(user?.user_id == order.user_id);
        setOrder(order);
        setIsCancelled(order.status === 'Cancelled')
      } catch (error) {
        if (!order_id) {
          showToast('Error fetching order: No order id provided', 'error');
          navigate('../');
          return;
        }
        showToast('Error fetching order', 'error');
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrder();
  }, []);
  return (
    <>
      {
        loading && !order
          ?
          <Typography variant="h6">Loading...</Typography>
          :
          <Box>
            <PageHeader header={"Order Details"} />
            {
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                {(!loading && (!isOwner) ? <Typography variant="h6" color="primary"><b>Buyer</b>  - {order.user?.first_name} {order.user?.last_name}</Typography> : <span></span>)
                }
                {
                  user && !isOwner && order.status !== "Received By Buyer"
                    ?
                    <Button variant="contained" size="small" color="error" onClick={handleCancelOrder} disabled={isCancelled}>Cancel Order</Button>
                    :
                    (isOwner ?
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleConfirmReceipt}
                        disabled={order.status == "Received By Buyer" || isConfirmed || isCancelled}
                      >
                        {order.status == "Received By Buyer" ? "Receipt Confirmed" : "Confirm Receipt"}
                      </Button>
                      :
                      <></>
                    )
                }
              </Box>
            }


            {/* Order Summary */}
            <Paper sx={{ padding: 2, mb: 3 }}>
              <Grid2 display={'grid'} container spacing={2} gridTemplateColumns={'1fr 1fr'}>
                <Grid2>
                  <Typography><strong>Order #:</strong> {order.order_id}</Typography>
                  <Typography><strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Not Paid'}</Typography>
                  <Typography><strong>Order Status:</strong> {order.status}</Typography>
                  <Typography><strong>Total Price:</strong> R{isOwner ? order.total_price : order?.seller_gain}</Typography>
                  <Typography><strong>Delivery Cost:</strong> R{order.delivery_cost}</Typography>
                </Grid2>

                <Grid2>
                  <Typography><strong>Phone:</strong> {order.user?.phone}</Typography>
                  <Typography><strong>Province:</strong> {order.province}</Typography>
                  <Typography><strong>Locker Location:</strong> {order.pudo_locker_location}</Typography>
                  <Typography><strong>Payment Option:</strong> {order.payment_option}</Typography>
                  <Typography><strong>Shipping Method:</strong> {order.shipping_method}</Typography>
                </Grid2>
              </Grid2>
            </Paper>

            {/* Order Items */}
            <PageHeader header={"Items in Order"} />

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
                  {order?.items?.map((item) => (
                    <TableRow key={item.order_item_id}>
                      <TableCell>
                        <img
                          src={item.product.photos[0].photo_url}
                          alt={item.product.title}
                          style={{ width: 50, height: 50, borderRadius: 4 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography><strong>{item.product.title}</strong></Typography>
                        <Typography variant="body2">{item.product.description}</Typography>
                      </TableCell>
                      <TableCell>R{isOwner ? item.product.price : item?.product?.seller_gain}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Rating and Confirm Receipt */}
            <Box sx={{ mt: 3 }}>
              {/* {order.status === "Received By Buyer" && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">Rate Your Order</Typography>
                  <Rating
                    value={rating}
                    onChange={(_event, newValue) => handleRating(newValue)}
                  />
                </Box>
              )} */}
            </Box>
          </Box>
      }
    </>
  );
};

export default ViewOrder;
