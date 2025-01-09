import { Divider, Stack } from "@mui/material";
import ProductItemGroup from "../../components/Products/ProductItemGroup";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { useEffect, useState } from "react";

const Home = () => {
  const {
    get
  } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { showToast } = useToastStore();
  const [shops, setShops] = useState([]);
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shops = await get(`/shop/fetch-shops?mustHaveProducts=true`);
        setShops(shops);
      } catch (error) {
        showToast("Error fetching shops:", 'error')
        console.error(error);
      }
    }

    fetchShops();
  }, []);

  return (
    <Stack display={"grid"} height={"100%"} rowGap={2}>
      {shops.map((shop, index) => (
        <>
          <ProductItemGroup shop={shop} key={shop.id} productsToShow={3} />
          <Divider />
        </>
      ))}
    </Stack>
  );
};

export default Home;
