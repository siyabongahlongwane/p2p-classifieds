import PageHeader from "../../components/PageHeader/PageHeader";
import ProductItem from "../../components/Products/ProductItem";
import { Grid2, Stack, Typography } from "@mui/material";
import { useStore } from "../../stores/store";

const Likes = () => {
  const { likes } = useStore();

  return (
    <Stack>
      <PageHeader header="My Likes" />
      {!likes?.length ? (
        <Typography variant="body1" color={'gray'}>You have no liked items</Typography>
      ) : (
        <Grid2 container gridTemplateColumns={"1fr 1fr 1fr"} gap={3}>
          {likes.map((product, index: number) => (
            <ProductItem key={index} product={product} />
          ))}
        </Grid2>
      )}
    </Stack>
  );
};

export default Likes;
