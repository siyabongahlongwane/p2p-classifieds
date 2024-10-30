import "./Menu.css";
import MenuItem from "../MenuItem/MenuItem";
import { useState } from 'react';
import { HomeOutlined, LocalShippingOutlined, LogoutOutlined, MarkChatUnreadOutlined, SettingsOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

const Menu = () => {
    const [activeMenuItem, setActiveMenuItem] = useState(0);
    const menuItems = [
        {
            Icon: HomeOutlined,
            route: '',
            label: 'Home'
        },
        {
            Icon:  ShoppingBagOutlined,
            route: '',
            label: 'My Shop'
        },
        {
            Icon:  LocalShippingOutlined,
            route: '',
            label: 'My Orders'
        },
        {
            Icon:  MarkChatUnreadOutlined,
            route: '',
            label: 'Messages'
        },
        {
            Icon:  SettingsOutlined,
            route: '',
            label: 'Settings'
        },
        {
            Icon:  LogoutOutlined,
            route: '',
            label: 'Logout',
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