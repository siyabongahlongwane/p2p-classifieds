import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  Delete,
  Favorite,
  FavoriteBorderOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import { useState } from "react";
import "./Product.css";

const ProductItem = ({ product }) => {
  const [liked, setLiked] = useState(true);
  const [isInCart, setIsInCart] = useState(true);
  const [isSold] = useState(true);
  const { price, status, photos } = product;
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
          border={'.5px solid #fff'}
          borderRadius={'0px 0px 0px 8px'}
          p={0.5}
        >
         <Typography fontSize={12} fontWeight={"400"}  > {status}</Typography>
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
                onClick={() => setLiked(!liked)}
                className="pointer like"
              />
            ) : (
              <FavoriteBorderOutlined
                htmlColor="var(--brown)"
                onClick={() => setLiked(!liked)}
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
