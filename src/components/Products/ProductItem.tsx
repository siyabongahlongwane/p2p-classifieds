import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  Favorite,
  FavoriteBorderOutlined,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import "./Product.css";
import useApi from "../../hooks/useApi";
import { UserContext } from "../../context/User/UserContext";
import { useStore } from "../../stores/store";
import { useNavigate } from "react-router-dom";
import CartItem from "../CartItem/CartItem";
import { CartItem as ICartItem, LikeItem } from "../../typings";

const ProductItem = ({ product }: { product: ICartItem }) => {
  const { price, status, photos, product_id } = product;
  const [liked, setLiked] = useState(false);
  const [isSold] = useState(false);
  const { user } = useContext(UserContext);

  const { post, remove } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { setLikes, likes, setField } = useStore();

  const navigate = useNavigate();

  const handleAddLike = async () => {
    const endpoint = `/likes/add-like`;
    const newLikes = await post(endpoint, {
      product_id,
      user_id: user.user_id,
    });
    setLikes([...newLikes]);
    setLiked(true);
  };

  const handleRemoveLike = () => {
    const likeToRemove = likes.find((p: LikeItem) => p.product_id === product_id)
      ?.like_item.like_id;
    const newLikes = likes.filter((p: LikeItem) => p.product_id !== product_id);
    remove(`/likes/remove-like/${likeToRemove}?user_id=${user.user_id}`).then(
      () => {
        setLikes([...newLikes]);
        setLiked(false);
      }
    );
  };

  return (
    <Stack width={180} className="product" position={"relative"}>
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
          <img
            src={photos[0]?.photo_url}
            alt="Image"
            width={"100%"}
            className="pointer"
            onClick={() => {
              setField("selectedProduct", product);
              navigate(`/view-product/${product_id}`);
            }}
          />
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
              <CartItem user_id={user?.user_id} product_id={product?.product_id} isButton />
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ProductItem;
