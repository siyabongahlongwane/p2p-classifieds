import "./MenuItem.css";
import { Typography } from "@mui/material";

import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from "react-router-dom";
import { MenuItem as MenuItemType } from "../../typings/MenuItem.type";

const MenuItem = ({
  item,
  activeMenuItem,
  setActiveMenuItem,
  index,
}: {
  item: MenuItemType;
  activeMenuItem: number;
  setActiveMenuItem: (key: string, val: number) => void;
  index: number;
}) => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const { label, Icon, logout, route } = item;
  const isActive = index === activeMenuItem;

  const handleItemClick = (route: string) => {
    setActiveMenuItem('activeMenuItem', index);
    localStorage.setItem('activeMenuItem', index.toString());
    navigate(route);
  };
  return (
    <div
      className="menu-item"
      onClick={() =>
        logout
          ? logout(setUser as any)
          : handleItemClick(route)
      }
    >
      <div className="icon-label">
        <Icon htmlColor={isActive ? "var(--blue)" : "var(--gray)"} />
        <Typography
          color={isActive ? "var(--blue)" : "var(--black)"}
          fontWeight={isActive ? "400" : "300"}
        >
          {label}
        </Typography>
      </div>
      {index === activeMenuItem && <div className="active-indicator" />}
    </div>
  );
};

export default MenuItem;
