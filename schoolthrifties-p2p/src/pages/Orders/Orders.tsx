import { Outlet } from 'react-router-dom'
import { Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useUserStore } from '../../stores/useUserStore';

const Orders = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div>
      {
        !user ? (
          <>
            <PageHeader header="My Orders" />
            <Typography fontSize={16} fontWeight={300}>
              Please login to view your orders
            </Typography>
          </>
        ) : (
          <Outlet />
        )
      }
    </div>
  )
}

export default Orders