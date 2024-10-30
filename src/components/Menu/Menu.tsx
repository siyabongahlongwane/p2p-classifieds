import "./Menu.css";
import MenuItem from "../MenuItem/MenuItem";
import { useState } from 'react';
import { HomeOutlined, LocalShippingOutlined, LogoutOutlined, MarkChatUnreadOutlined, SettingsOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { MenuItem as MenuItemType} from "../../typings/MenuItem.type";

const Menu = () => {
    const [activeMenuItem, setActiveMenuItem] = useState(0);
    const menuItems: MenuItemType[] = [
        {
            Icon: HomeOutlined,
            route: 'home',
            label: 'Home',
        },
        {
            Icon:  ShoppingBagOutlined,
            route: 'my-shop',
            label: 'My Shop',
        },
        {
            Icon:  LocalShippingOutlined,
            route: 'my-orders',
            label: 'My Orders',
        },
        {
            Icon:  MarkChatUnreadOutlined,
            route: 'messages',
            label: 'Messages',
        },
        {
            Icon:  SettingsOutlined,
            route: 'settings',
            label: 'Settings',
        },
        {
            Icon:  LogoutOutlined,
            label: 'Logout',
            route: '',
            logout: useAuth().logout
        },
    ]
    return (
        <div className='menu'>
            {
                menuItems.map((item, index) => <MenuItem key={index} item={item} index={index} activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} />)
            }
        </div>
    )
}

export default Menu