import { Box, Grid2, Stack, Typography } from "@mui/material";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { PlainProduct } from "../../typings";

const ProductItemGroup = ({ shop, productsToShow }: any) => {
  shop.products = productsToShow ? shop.products.slice(0, productsToShow) : shop.products;
  return (
    <Stack gap={1}>
      <Stack>
        <Typography fontWeight={500}>Shop Details</Typography>
        <Box display={"flex"} alignItems={"center"} fontSize={12} gap={".2rem"}>
          <Typography fontSize={14} fontWeight={400}>
            Name:
          </Typography>

          <Typography fontSize={14} fontWeight={400}>
            {shop.name}
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} fontSize={14} gap={".2rem"}>
          <Typography fontSize={14} fontWeight={400}>
            Shop Link:
          </Typography>
          <Link
            style={{ color: "#d32f2f", fontWeight: 400 }}
            color="var(--blue)"
            to={"/shops/" + shop.link}
          >
            @{shop.link}
          </Link>
        </Box>
      </Stack>
      <Grid2 display={'grid'} container gridTemplateColumns={"1fr 1fr 1fr 1fr 1fr"} gap={3}>
        {shop.products.map((product: PlainProduct, index: number) => (
          <ProductItem key={index} product={product} />
        ))}
      </Grid2>
    </Stack>
  );
};

export default ProductItemGroup;
