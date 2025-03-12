import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { UserContext } from '../../context/User/UserContext'
import { Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader/PageHeader';

const Orders = () => {
  const { user } = useContext(UserContext);

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