import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  Delete,
  Favorite,
  FavoriteBorderOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import "./Product.css";
import useApi from "../../hooks/useApi";
import { UserContext } from "../../context/User/UserContext";
import { useStore } from "../../stores/store";
import { isLiked } from "../../utils/product.util";

const ProductItem = ({ product }) => {
  const { price, status, photos, product_id } = product;
  const [liked, setLiked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isSold] = useState(false);
  const { user } = useContext(UserContext);

  const { post, remove } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { setLikes, likes } = useStore();

  useEffect(() => {
    setLiked(
      isLiked(
        product_id,
        likes.map((p: any) => p.product_id)
      )
    );
  }, [liked, likes?.length, user]);
  const handleAddLike = async () => {
    const endpoint = `/likes/add-like`;
    const newLike = await post(endpoint, { product_id, user_id: user.user_id });

    setLikes([...likes, newLike]);
    setLiked(true);
  };

  const handleRemoveLike = () => {
    remove(
      `/likes/remove-like/${
        likes.find((p: any) => p.product_id === product_id)?.like_item.like_id
      }`
    ).then(() => {
      setLikes(likes.filter((p: any) => p.product_id !== product_id));
      setLiked(false);
    });
  };

  return (
    <Stack width={180} className="pointer product" position={"relative"}>
      {isSold && (
        <Box
          position={"absolute"}
          top={0}
          right={0}
          bgcolor={"#000"}
          color={"#fff"}
          fontWeight={"bold"}
          border={".5px solid #fff"}
          borderRadius={"0px 0px 0px 8px"}
          p={0.5}
        >
          <Typography fontSize={12} fontWeight={"400"}>
            {status}
          </Typography>
        </Box>
      )}
      <Paper>
        <Box>
          <img src={photos[0]?.photo_url} alt="Image" width={"100%"} />
        </Box>
        <Stack p={1} gap={0.5}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontSize={16} fontWeight={500}>
              R{price}
            </Typography>
            {liked ? (
              <Favorite
                htmlColor="var(--brown)"
                onClick={() => handleRemoveLike()}
                className="pointer like"
              />
            ) : (
              <FavoriteBorderOutlined
                htmlColor="var(--brown)"
                onClick={() => handleAddLike()}
                className="pointer like"
              />
            )}
          </Box>
          <Stack display={"flex"} gap={0.5}>
            <Box display={"flex"} justifyContent={"center"}>
              <Box
                onClick={() => setIsInCart(!isInCart)}
                display={"flex"}
                gap={0.5}
                alignItems={"center"}
                bgcolor={!isInCart ? "#c2b280" : "#d32f2f"}
                borderRadius={2}
                p={0.5}
                className="pointer"
              >
                {!isInCart ? (
                  <ShoppingCart sx={{ ...iconStyles }} />
                ) : (
                  <Delete sx={{ ...iconStyles }} />
                )}
                <Typography
                  fontSize={11}
                  color={!isInCart ? "#000" : "#fff"}
                  fontWeight={"400"}
                >
                  {isInCart ? "Remove from cart" : " Add to cart"}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ProductItem;

const iconStyles = {
  fontSize: 14,
  color: "#000",
  backgroundColor: "#fff",
  borderRadius: "50%",
  padding: 0.3,
};
