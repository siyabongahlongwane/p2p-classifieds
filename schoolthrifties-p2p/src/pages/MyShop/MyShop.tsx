import { Box, Grid2, Stack, Typography } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";
import {  useState, useEffect } from "react";
import { useUserStore } from '../../stores/useUserStore';
import { Outlet, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import MyShopItem from "./MyShopItem";
import { useStore } from "../../stores/store";
import useToastStore from "../../stores/useToastStore";
import { PlainProduct } from "../../typings";

const MyShop = () => {
  const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);
  const [isAddNewProduct, setIsAddNewProduct] = useState(
    window.location.pathname.includes("add-product")
  );
  const navigate = useNavigate();

  const { loading, get } = useApi(
    `${import.meta.env.VITE_API_URL}`
  );
  const { selectedShop, setField } = useStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const [shop] = await get(`/shop/fetch-shops?user_id=${user.user_id}`);
        if (!shop) throw new Error('Error fetching shop');

        setField("selectedShop", shop);
      } catch (error) {
        const _error = error instanceof Error ? error.message : error;
        showToast(_error as string, 'error');
        console.error('error', _error);
        return;
      }
    };

    fetchShop();
  }, [window.location.href]);

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
              setField("productPhotos", []);
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
        : (
          !selectedShop?.products?.length && !isAddNewProduct
            ?
            <>
              <Typography fontSize={16} fontWeight={300}>
                No shop items found, click on the button to add some
              </Typography>
            </>
            :
            <Grid2 container display={'grid'} gridTemplateColumns={isAddNewProduct ? '1fr' : '1fr 1fr 1fr 1fr 1fr'} gap={3}>
              {!isAddNewProduct && selectedShop?.products ? (
                selectedShop && selectedShop.products.map((product: PlainProduct, index: number) => (
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
