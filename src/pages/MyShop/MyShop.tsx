import { Box, Grid2, Stack, Typography } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/User/UserContext";
import { Outlet, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import MyShopItem from "./MyShopItem";
import { useStore } from "../../stores/store";

const MyShop = () => {
  const { user } = useContext(UserContext);
  const [isAddNewProduct, setIsAddNewProduct] = useState(
    window.location.pathname.includes("add-product")
  );
  const navigate = useNavigate();

  const { loading, error, get, post, put, remove } = useApi(
    `${import.meta.env.VITE_API_URL}`
  );
  const { selectedShop, setField } = useStore();

  useEffect(() => {
    const fetchShop = async () => {
      const [shop] = await get(`/shop/fetch?user_id=${user.user_id}`);
      try {
        setField("selectedShop", shop);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShop();
  }, [selectedShop.shop_id]);

  useEffect(() => {
    setIsAddNewProduct(window.location.pathname.includes("add-product") || window.location.pathname.includes("edit-product"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

  return (
    <Stack>
      <Box display={"flex"} alignItems={"center"} gap={3}>
        <PageHeader header={isAddNewProduct ? "My Shop - Add New Product" : "My Shop"} />
        {user && !isAddNewProduct && (
          <Box
            mb={"16px"}
            border={"1px solid var(--blue)"}
            bgcolor={"var(--blue)"}
            color={"#fff"}
            borderRadius={"8px"}
            p={0.5}
            className="pointer"
            sx={{ ":hover": { opacity: 0.75 } }}
            onClick={() => {
              setIsAddNewProduct(true);
              setField( "productPhotos", []);
              navigate("add-product");
            }}
          >
            <Typography fontSize={12}>+ Add New Product</Typography>
          </Box>
        )}
      </Box>

      {!user ? (
        <Typography fontSize={16} fontWeight={300}>
          Please login to view your shop
        </Typography>
      ) : loading ? (
        <Typography fontSize={16} fontWeight={300}>
          Loading...
        </Typography>
      ) 
      // : 
      // !loading && !!selectedShop?.products?.length ? (
      //   <Typography fontSize={16} fontWeight={300}>
      //     No shop items found, click on the button to add some
      //   </Typography>
      // )
       : (
        <Grid2 container gridTemplateColumns={'1fr 1fr 1fr 1fr'} gap={3}>
          {!isAddNewProduct && selectedShop?.products ? (
            selectedShop && selectedShop.products.map((product, index) => (
              <MyShopItem key={index} product={product} />
            ))
          ) : (
            <Outlet />
          )}
        </Grid2>
      )}
    </Stack>
  );
};

export default MyShop;
