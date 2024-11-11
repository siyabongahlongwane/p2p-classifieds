import { useContext, useEffect } from "react";
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
import { UserContext } from "../../context/User/UserContext";
import useApi from "../../hooks/useApi";
import { useStore } from "../../stores/store";
// import Drawer from '../Drawer/Drawer';

const Header = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    loading,
    get,
  } = useApi(`${import.meta.env.VITE_API_URL}`);

  const { setLikes, likes } = useStore();
  const fetchLikes = async () => {
    const likes = await get("/likes/fetch-likes");
    setLikes(likes);
  };
  useEffect(() => {
    fetchLikes();
  }, []);

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
            count={100}
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
              count={5}
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
