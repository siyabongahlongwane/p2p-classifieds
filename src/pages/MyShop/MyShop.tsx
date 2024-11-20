import { Box, Stack, Typography } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/User/UserContext";
import { Outlet, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";

const MyShop = () => {
  // const handleAdd = async () => {
  //     await post('/items', { name: 'New Item' });
  //     // Optionally refetch or update the local state
  // };

  // const handleUpdate = async (id) => {
  //     await put(`/items/${id}`, { name: 'Updated Item' });
  // };

  // const handleDelete = async (id) => {
  //     await remove(`/items/${id}`);
  // };

  const { user } = useContext(UserContext);
  const [isAddNewProduct, setIsAddNewProduct] = useState(
    window.location.pathname.includes("add-product")
  );
  const navigate = useNavigate();
  const shopItems = [];

  const { data, loading, error, get, post, put, remove } = useApi(
    `${import.meta.env.VITE_API_URL}`
  );

  useEffect(() => {
    get(`/shop/fetch?user_id=${user.user_id}`); // Fetch items on mount
  }, []);

  useEffect(() => {
    setIsAddNewProduct(window.location.pathname.includes("add-product"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);
  return (
    <Stack>
      <Box display={"flex"} alignItems={"center"} gap={3}>
        <PageHeader header="My Shop" />
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
              navigate("add-product");
            }}
          >
            <Typography fontSize={12}>+ Add New Product</Typography>
          </Box>
        )}
      </Box>

      {!user ? (
        <Typography fontSize={16} fontWeight={300}>
          Please login to view your shop items
        </Typography>
      ) : user && !!shopItems.length ? (
        <Typography fontSize={16} fontWeight={300}>
          No shop items found, click on the button to add some
        </Typography>
      ) : (
        <Box>
          <Outlet />
        </Box>
      )}
    </Stack>
  );
};

export default MyShop;
