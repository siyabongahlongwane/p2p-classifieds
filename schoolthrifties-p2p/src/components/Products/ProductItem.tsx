import { Box, Paper, Stack, Typography } from "@mui/material";
import {  useState } from "react";
import "./Product.css";
import { useUserStore } from '../../stores/useUserStore';
import { useStore } from "../../stores/store";
import { useNavigate } from "react-router-dom";
import CartItem from "../CartItem/CartItem";
import { PlainProduct } from "../../typings";
import LikeItem from "../LikeItem/LikeItem";

const ProductItem = ({ product }: { product: PlainProduct }) => {
  const { price, status, photos, product_id } = product;
  const [isSold] = useState(status === "Sold");
  const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);

  const { setField } = useStore();

  const navigate = useNavigate();


  return (
    <Stack width={'inherit'} className="product" position={"relative"}>
      {isSold && (
        <Box
          position={"absolute"}
          top={0}
          right={0}
          bgcolor={"#1976d2"}
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
        <Box className='product-img'>
          <img
            src={photos[0]?.photo_url}
            alt="Image"
            width={"100%"}
            height={'100%'}
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
            justifyContent={isSold ? "center" : "space-between"}
            alignItems={"center"}
          >
            <Typography fontSize={16} fontWeight={500}>
              R{price}
            </Typography>
            {
              !isSold && <Box display={"flex"} justifyContent={"center"}>
                <LikeItem user={user} product_id={product?.product_id} />
              </Box>
            }

          </Box>
          {
            !isSold && <Stack display={"flex"} gap={0.5}>
              <Box display={"flex"} justifyContent={"center"}>
                <CartItem user={user} product_id={product?.product_id} shop_id={product?.shop_id} isButton />
              </Box>
            </Stack>
          }

        </Stack>
      </Paper>
    </Stack >
  );
};

export default ProductItem;
