import { Grid2 } from "@mui/material";
import ProductItemGroup from "./ProductItemGroup";

const ProductList = () => {
  return (
    <Grid2
      container
      gridTemplateColumns={"1fr 1fr"}
      justifyContent={"space-between"}
    >
      <Grid2>
        <ProductItemGroup />
      </Grid2>
      <Grid2>
        <ProductItemGroup />
      </Grid2>
    </Grid2>
  );
};

export default ProductList;
