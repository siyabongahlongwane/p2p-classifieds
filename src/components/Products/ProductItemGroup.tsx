import { Grid2, Stack, Typography } from "@mui/material";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const ProductItemGroup = () => {
  return (
    <Stack gap={1}>
      <Stack>
        <Typography fontWeight={"500"}>Shop Details</Typography>
        <Typography fontSize={14}>
          <b>Owner</b>: Siyabonga Hlongwane
        </Typography>
        <Typography fontSize={14}>
          <b>Shop Link:</b>
          <Link
            style={{ color: "#d32f2f", fontWeight: "500" }}
            color="#c2b280"
            to="/shop"
          >
            @siyabonga
          </Link>
        </Typography>
      </Stack>
      <Grid2 container gridTemplateColumns={"1fr 1fr 1fr"} gap={3}>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <ProductItem key={index} />
          ))}
      </Grid2>
    </Stack>
  );
};

export default ProductItemGroup;
