import { Box, Divider, Stack } from "@mui/material";
import ProductItemGroup from "../../components/Products/ProductItemGroup";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { useContext, useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useStore } from "../../stores/store";
import { UserContext } from "../../context/User/UserContext";

const Home = () => {
  const {
    get
  } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { showToast } = useToastStore();
  const [shops, setShops] = useState([]);
  const { user } = useContext(UserContext);

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
  }, []);

  return (
    <Stack display={"grid"} height={"100%"} rowGap={2}>
      {shops?.length ? shops.map((shop) => (
        <Box key={Math.random()} >
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
