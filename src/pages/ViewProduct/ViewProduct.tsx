import { Box, Chip, Grid2, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useStore } from "../../stores/store";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import {
  ChatBubbleOutlineRounded,
  FavoriteBorder,
  PinDropOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";

const ViewProduct = () => {
  const { selectedProduct, setField, categories } = useStore();
  const { product_id } = useParams();
  const { get, data, loading, error } = useApi(import.meta.env.VITE_API_URL);
  const [images, setImages] = useState([]);
  const actions = [
    {
      name: "Add To Cart",
      icon: ShoppingCartOutlined,
      onClick: () => { },
    },
    {
      name: "Like",
      icon: FavoriteBorder,
      onClick: () => { },
    },
    {
      name: "Message Seller",
      icon: ChatBubbleOutlineRounded,
      onClick: () => { },
    },
  ];
  const fetchCategories = async () => {
    const categories = await get("/categories/fetch");
    try {
      setField("categories", categories);
    } catch (error) {
      console.error(error);
    }
  };

  const transformPhotos = (photos) => {
    return photos.map((photo) => ({
      original: photo.photo_url,
      thumbnail: photo.photo_url,
    }));
  }

  useEffect(() => {
    if (!selectedProduct) {
      get("/product/fetch?product_id=" + product_id).then(([product]) => {
        setField("selectedProduct", product);
        setImages(transformPhotos(product.photos));
      });
    }
    else setImages(transformPhotos(selectedProduct.photos));

    fetchCategories();
  }, [product_id, selectedProduct]);

  return (
    <Stack>
      {loading ? (
        <Typography>...loading</Typography>
      ) : error ? (
        <Typography>{error}</Typography>
      ) : selectedProduct ? (
        <Stack
          display={"grid"}
          gridTemplateColumns={"1.2fr 1.5fr"}
          gap={3}
          p={"0 1.5em 0 0"}
        >
          {<Grid2>
            <ImageGallery
              items={images}
              showPlayButton={true}
              showFullscreenButton={true}
              slideInterval={2000}
              slideOnThumbnailOver={true}
              showIndex={true}
              onPlay={() => { }}
            />
          </Grid2>}
          <Grid2 display={"flex"} flexDirection={"column"} gap={2} mt={10}>
            <Typography variant="h5">{selectedProduct?.title}</Typography>
            <Typography color={"gray"}>
              {selectedProduct?.description}
            </Typography>
            <Box display={'flex'} alignItems={'center'} gap={.5} color={"gray"}>
              <PinDropOutlined></PinDropOutlined>
              <Typography variant="body2">{selectedProduct?.location}</Typography>
            </Box>
            <Box gap={1} display={"flex"}>
              <Chip label={selectedProduct?.condition}></Chip>
              <Chip
                label={
                  categories?.find(
                    (c) => c.category_id == selectedProduct?.category_id
                  )?.title
                }
                key={selectedProduct?.category_id}
              ></Chip>
            </Box>
            <Typography variant="h5" color="var(--blue)" fontWeight={500}>
              R{selectedProduct?.price}
            </Typography>
            <Stack gap={0.5} color={"gray"}>
              <Typography variant="body2">
                + Delivery from R59.00 with PUDO Locker-to-Locker & Kiosks
              </Typography>
              <Typography variant="body2">+ Buyer Protection fee</Typography>
            </Stack>
            <Box display={"flex"} gap={4} justifyContent={"space-around"}>
              {actions.map((action, index) => (
                <Stack key={index} alignItems={"center"} gap={1} className="pointer">
                  <action.icon htmlColor="var(--blue)" />
                  <Typography fontSize={12} fontWeight={300} variant="body2">
                    {action.name}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Grid2>
        </Stack>
      )
        :
        <Typography>Product not found</Typography>
      }
    </Stack>
  );
};

export default ViewProduct;
