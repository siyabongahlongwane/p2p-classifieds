import { useContext } from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";
import { Box, Typography } from "@mui/material";
import {
  FavoriteBorderOutlined,
  NotificationsOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Badge from "../Badge/Badge";
// import { UserContext } from '../../context/UserContext';
// import Drawer from '../Drawer/Drawer';

const Header = () => {
  // const { user } = useContext(UserContext);
  const user = {name:'', email: ''};
  return (
    <Box className="header">
      <Box className="menu-search">
        {/* <Drawer /> */}
        <SearchBar />
      </Box>
      <Box className="user-actions">
        <Box className="icons">
          <Badge count={100} Icon={ShoppingCartOutlined} />
          <Badge count={3} Icon={FavoriteBorderOutlined} />
          <Badge count={5} Icon={NotificationsOutlined} />
        </Box>
        <Box className="profile-section">
          <Box className="avatar" bgcolor={'var(--blue)'}>
            <Typography component="b" fontSize={18}>
              {user?.name?.[0] ?? "S"}
            </Typography>
          </Box>
          <Box className="user-details">
            <Box className="user-name">
              <Typography className="ellipsis" component="b" fontSize={12}>
                {user?.name || "Siyabonga Hlongwane"}
              </Typography>
              <Typography className="ellipsis" component="span" fontSize={12}>
                {user?.email || "test@abc.com"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
