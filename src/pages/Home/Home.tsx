import { Stack, Typography } from "@mui/material";
import ProductItemGroup from "../../components/Products/ProductItemGroup";
import useApi from "../../hooks/useApi";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/User/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const {
    data: shops,
    loading,
    error,
    get,
  } = useApi(`${import.meta.env.VITE_API_URL}`);

  useEffect(() => {
    get(`/shop/fetch`); // Fetch items on mount
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
