import ProductItem from "../../components/Products/ProductItem";
import { Box, Grid2, Stack, Typography } from "@mui/material";
import { useStore } from "../../stores/store";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";

const Cart = () => {
  const { cart, checkoutCrumbs } = useStore();
  const navigate = useNavigate();
  return (
    <Stack position={"relative"}>
      <Breadcrumb crumbs={checkoutCrumbs} activeCrumb={0} fontSize={20} />
      {!cart?.length ? (
        <>
          <FloatingActionButton title="Go To Shops" action={() => navigate("/home")} />
          <Typography variant="body1" color={"gray"}>
            You have no cart items
          </Typography>
        </>
      ) : (
        <Grid2 container gridTemplateColumns={"1fr 1fr 1fr"} gap={3}>
          {[...cart].map((product, index: number) => (
            <ProductItem key={index} product={product} />
          ))}
        </Grid2>
      )}
      {!!cart?.length && <FloatingActionButton title="Edit Shipping Details" action={() => navigate("/shipping-details")} />}
    </Stack>
  );
};

export default Cart;
