import { Stack } from "@mui/material";
import ProductItem from "../../components/Products/ProductItem";
import PageHeader from "../../components/PageHeader/PageHeader";

const Cart = () => {
  return (
    <Stack>
      <PageHeader header="My Cart" />
      <Stack display={"grid"} gridTemplateColumns={"repeat(6, 1fr)"} gap={1.5}>
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
      </Stack>
    </Stack>
  );
};

export default Cart;
