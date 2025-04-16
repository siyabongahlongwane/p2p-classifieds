import { useEffect } from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";
import { Box, Button, Typography } from "@mui/material";
import {
  FavoriteBorderOutlined,
  NotificationsOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Badge from "../Badge/Badge";
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../../stores/useUserStore';
import useApi from "../../hooks/useApi";
import { useStore } from "../../stores/store";
import useToastStore from "../../stores/useToastStore";
// import Drawer from '../Drawer/Drawer';

const Header = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const { loading, get } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { setLikes, likes = [], setCart, cart = [], setField, orderObject } = useStore();
  const { showToast } = useToastStore();

  const fetchLikes = async () => {
    if (user) {
      try {
        const likes = await get(`/likes/fetch-likes`);
        const cart = await get(`/cart/fetch-cart`);
        if (!likes) throw new Error('Error fetching likes');
        if (!cart) throw new Error('Error fetching cart items');

        setLikes(likes);
        setCart(cart);
      } catch (error) {
        const _error = error instanceof Error ? error.message : error;
        showToast(_error as string, 'error');
        console.error('error', _error);
        return;
      }
    }
  };
  useEffect(() => {
    fetchLikes();
  }, []);

  useEffect(() => {
    setField('orderObject', { ...orderObject, cart })
  }, [cart]);

  return (
    <Box className="header">
      <Box className="menu-search">
        {/* <Drawer /> */}
        <SearchBar />
      </Box>
      <Box className="user-actions">
        <Box className="icons">
          <Badge
            onClick={() => navigate("cart")}
            count={loading ? 0 : cart.length}
            Icon={ShoppingCartOutlined}
          />
          <Badge
            onClick={() => navigate("likes")}
            count={loading ? 0 : likes.length}
            Icon={FavoriteBorderOutlined}
          />
          {user && (
            <Badge
              onClick={() => navigate("cart")}
              count={loading ? 0 : cart.length}
              Icon={NotificationsOutlined}
            />
          )}
        </Box>
        {user ? (
          <Box className="profile-section">
            <Box className="avatar" bgcolor={"var(--blue)"}>
              <Typography component="b" fontSize={18}>
                {user.first_name[0]}
              </Typography>
            </Box>
            <Box className="user-details">
              <Box className="user-name">
                <Typography className="ellipsis" component="b" fontSize={12}>
                  {user.first_name}
                </Typography>
                <Typography className="ellipsis" component="span" fontSize={12}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Button variant="outlined" onClick={() => navigate("/sign-in")}>
            Sign In
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
