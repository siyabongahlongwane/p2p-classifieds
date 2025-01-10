import OrdersList from '../../components/OrdersList/OrdersList'
import { Box, Typography } from '@mui/material'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/User/UserContext';
import useApi from '../../hooks/useApi';
import { OrderPreview, OrderWithItems } from '../../typings/Order.int';
import { useNavigate } from 'react-router-dom';
import useToastStore from '../../stores/useToastStore';

const MyOrders = () => {
  const { user } = useContext(UserContext);
  const { get } = useApi(`${import.meta.env.VITE_API_URL}`);
  const [orders, setOrders] = useState<OrderPreview[]>([]);
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let orders = await get(`/orders/fetch-orders?user_id=${user.user_id}`);

        if (!orders) throw new Error('Error fetching orders');

        orders = orders.map((order: OrderWithItems) => {
          return {
            order_id: order.order_id,
            buyerName: 'Owner By You',
            date: new Date(order.created_at).toLocaleString(),
            totalAmount: order.total_price,
            status: order.status,
          }
        })

        setOrders(orders);
      } catch (error) {
        const _error = error instanceof Error ? error.message : error;
        showToast(_error as string, 'error');
        console.error('error', _error);
        return;
      }
    };
    fetchOrders();
  }, []);
  return (
    <>
      <Box display={"flex"} alignItems={"center"} gap={3}>
        <PageHeader header={"My Orders"} />
        <Box
          mb={"16px"}
          border={"1px solid var(--blue)"}
          bgcolor={"var(--blue)"}
          color={"#fff"}
          borderRadius={"8px"}
          p={0.5}
          className="pointer"
          sx={{ ":hover": { opacity: 0.75 } }}
          onClick={() => navigate('../customer-orders')}
        >
          <Typography fontSize={12}>View Customer Orders</Typography>
        </Box>
      </Box>
      <OrdersList orders={orders} showEdit={false} />
    </>
  )
}

export default MyOrders;