import OrdersList from '../../components/OrdersList/OrdersList'
import { Box, Typography } from '@mui/material'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/User/UserContext';
import useApi from '../../hooks/useApi';
import { OrderPreview, OrderWithItems } from '../../typings/Order.int';
import { useNavigate } from 'react-router-dom';

const CustomerOrders = () => {
  const { user } = useContext(UserContext);
  const { get } = useApi(`${import.meta.env.VITE_API_URL}`);
  const [orders, setOrders] = useState<OrderPreview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let orders = await get(`/orders/fetch-orders?shop_id=${user.shop_id}`);
        orders = orders.map((order: OrderWithItems) => {
          return {
            order_id: order.order_id,
            buyerName: `${order.user.first_name} ${order.user.last_name}`,
            date: new Date(order.created_at).toLocaleString(),
            totalAmount: order.total_price,
            status: order.status,
          }
        })

        setOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
      <OrdersList orders={orders} showEdit />
    </>
  )
}

export default CustomerOrders;