import { Alert, Box, Divider, Stack } from "@mui/material";
import ProductItemGroup from "../../components/Products/ProductItemGroup";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useUserStore } from '../../stores/useUserStore';

const Home = () => {
  const {
    get
  } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { showToast } = useToastStore();
  const [shops, setShops] = useState([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {

    const fetchShops = async () => {
      try {
        const shops = user ? (await get(`/shop/fetch-shops?mustHaveProducts=true`)).filter((shop: any) => shop.shop_id != user.shop_id) : await get(`/shop/fetch-shops?mustHaveProducts=true`);
        if (!shops) throw new Error('Error fetching shops');

        setShops(shops);
      } catch (error) {
        const _error = error instanceof Error ? error.message : error;
        showToast(_error as string, 'error');
        console.error('error', _error);
        return;
      }
    }

    fetchShops();
  }, [user]);

  return (
    <Stack display={"grid"} height={"100%"} rowGap={2}>
      {shops?.length ? shops.map((shop: any) => (
        <Box key={Math.random()} >
          {
            shop?.shop_closure?.is_active && new Date(shop?.shop_closure.end_date) > new Date()
            &&
            <Alert severity="warning" sx={{ mb: 2 }}>
              This shop is temporarily closed and not processing orders from <b>{shop?.shop_closure.start_date}</b> to <b>{shop?.shop_closure.end_date}</b>
              {shop?.shop_closure.reason && <> With Reason — <b>{shop?.shop_closure.reason}</b></>}
            </Alert>
          }
          <ProductItemGroup shop={shop} productsToShow={3} />
          <Divider />
        </Box>
      ))
        :
        <PageHeader header="No Shops Found" />
      }
    </Stack>
  );
};

export default Home;
