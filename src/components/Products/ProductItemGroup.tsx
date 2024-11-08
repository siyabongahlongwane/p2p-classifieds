import { Box, Grid2, Stack, Typography } from "@mui/material";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const ProductItemGroup = ({ shop }: any) => {
  return (
    <Stack gap={1}>
      <Stack>
        <Typography fontWeight={"500"}>Shop Details</Typography>
        <Box display={"flex"} alignItems={"center"} fontSize={12} gap={".2rem"}>
          <Typography fontSize={14} fontWeight={"400"}>
            Name:
          </Typography>

          <Typography fontSize={14} fontWeight={"400"}>
            {shop.name}
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} fontSize={14} gap={".2rem"}>
          <Typography fontSize={14} fontWeight={"400"}>
            Shop Link:
          </Typography>
          <Link
            style={{ color: "#d32f2f", fontWeight: "400" }}
            color="#c2b280"
            to={"/shop/" + shop.link}
          >
            @{shop.link}
          </Link>
        </Box>
      </Stack>
      <Grid2 container gridTemplateColumns={"1fr 1fr 1fr"} gap={3}>
        {shop.products.map((product, index: number) => (
          <ProductItem key={index} product={product} />
        ))}
      </Grid2>
    </Stack>
  );
};

export default ProductItemGroup;
