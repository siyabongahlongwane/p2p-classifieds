import { useContext, useEffect, useState } from "react";
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
  Rating,
  Grid2,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { OrderWithItems } from "../../typings/Order.int";
import PageHeader from "../../components/PageHeader/PageHeader";
import { UserContext } from "../../context/User/UserContext";

const ViewOrder = () => {
  const { get, loading } = useApi(`${import.meta.env.VITE_API_URL}`);
  const [order, setOrder] = useState<OrderWithItems>({} as OrderWithItems);
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { order_id } = useParams();
  const { user } = useContext(UserContext);
  const [isOwner, setIsOwner] = useState(false);
  const handleConfirmReceipt = () => {
    // Mock API call
    setIsConfirmed(true);
    console.log("Order receipt confirmed:", order.order_id);
  };

  const handleRating = (newRating: number | null) => {
    setRating(newRating);
    console.log("Rated order:", { orderId: order.order_id, rating: newRating });
  };

  useEffect(() => {
    if (!order_id) navigate('/orders/my-orders');
    const fetchOrder = async () => {
      try {
        const [order] = await get(`/orders/fetch-orders?order_id=${order_id}`);
        setIsOwner(user.user_id == order.user_id);
        setOrder(order);
      } catch (error) {
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
              !loading && (!isOwner) && <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                <Typography variant="h6" color="primary"><b>Customer</b>  - {order.user?.first_name} {order.user?.last_name}</Typography>
                {!isConfirmed &&<Button variant="contained" size="small" color="error">Cancel Order</Button>}
              </Box>
            }


            {/* Order Summary */}
            <Paper sx={{ padding: 2, mb: 3 }}>
              <Grid2 display={'grid'} container spacing={2} gridTemplateColumns={'1fr 1fr'}>
                <Grid2>
                  <Typography><strong>Order #:</strong> {order.order_id}</Typography>
                  <Typography><strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Not Paid'}</Typography>
                  <Typography><strong>Order Status:</strong> {order.status}</Typography>
                  <Typography><strong>Total Price:</strong> R{order.total_price}</Typography>
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
                      <TableCell>R{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Rating and Confirm Receipt */}
            <Box sx={{ mt: 3 }}>
              {order.status === "Received By Buyer" && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">Rate Your Order</Typography>
                  <Rating
                    value={rating}
                    onChange={(_event, newValue) => handleRating(newValue)}
                  />
                </Box>
              )}

              {isOwner && <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmReceipt}
                disabled={isConfirmed}
              >
                {isConfirmed ? "Receipt Confirmed" : "Confirm Receipt"}
              </Button>}
            </Box>
          </Box>
      }
    </>
  );
};

export default ViewOrder;
