import { Stack, Typography } from "@mui/material";
import ProductItem from "../../components/Products/ProductItem";

const Cart = () => {
    return (
        <Stack>
          <Typography fontWeight={"600"} variant="h1" fontSize={25} mb={2}>
            My Cart
          </Typography>
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
}

export default Cart;