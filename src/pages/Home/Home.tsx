import { Stack, Typography } from "@mui/material";
import ProductItemGroup from "../../components/Products/ProductItemGroup";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { useEffect } from "react";

const Home = () => {
  const {
    data: shops,
    loading,
    error,
    get,
  } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { showToast } = useToastStore();

  useEffect(() => {
    try {
      get(`/shop/fetch`); // Fetch items on mount
    } catch (error) {
      showToast("Error fetching orders:", 'error')
      console.error(error);
    }
  }, []);

  return (
    <Stack display={"grid"} height={"100%"} rowGap={2}>
      {error ? (
        <Typography variant="h6">{error}</Typography>
      ) : loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        shops.map((shop, index) => (
          <ProductItemGroup shop={shop} key={index} />
        ))
      )}
    </Stack>
  );
};

export default Home;
