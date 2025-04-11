import OrdersList from '../../components/OrdersList/OrdersList'
import { Box, Typography } from '@mui/material'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useEffect, useState } from 'react';
;
import useApi from '../../hooks/useApi';
import { OrderPreview, OrderWithItems } from '../../typings/Order.int';
import { useNavigate } from 'react-router-dom';
import useToastStore from '../../stores/useToastStore';
import { useUserStore } from '../../stores/useUserStore';

const CustomerOrders = () => {
  const user = useUserStore((state) => state.user);
  const { get } = useApi(`${import.meta.env.VITE_API_URL}`);
  const [orders, setOrders] = useState<OrderPreview[]>([]);
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let orders = await get(`/orders/fetch-orders?shop_id=${user?.shop_id}`);
        if (!orders) throw new Error('Error fetching orders');

        orders = orders.map((order: OrderWithItems) => {
          return {
            order_id: order.order_id,
            buyerName: `${order.user.first_name} ${order.user.last_name}`,
            date: new Date(order.created_at).toLocaleString(),
            totalAmount: order.seller_gain,
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
        <PageHeader header={"Customers Orders"} />
        <Box
          mb={"16px"}
          border={"1px solid var(--blue)"}
          bgcolor={"var(--blue)"}
          color={"#fff"}
          borderRadius={"8px"}
          p={0.5}
          className="pointer"
          sx={{ ":hover": { opacity: 0.75 } }}
          onClick={() => navigate('../my-orders')}
        >
          <Typography fontSize={12}>View My Orders</Typography>
        </Box>
      </Box>
      <OrdersList orders={orders} showPayNow={false} />
    </>
  )
}

export default CustomerOrders;