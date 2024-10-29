import PageHeader from "../../components/PageHeader/PageHeader";
import ProductItem from "../../components/Products/ProductItem";
import { Stack } from "@mui/material";

const Likes = () => {
  return (
    <Stack>
      <PageHeader header="My Likes" />
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
