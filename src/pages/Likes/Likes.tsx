import ProductItem from "../../components/Products/ProductItem";
import { Stack, Typography } from "@mui/material";

const Likes = () => {
  return (
    <Stack>
      <Typography fontWeight={"600"} variant="h1" fontSize={25} mb={2}>
        My Likes
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
};

export default Likes;
