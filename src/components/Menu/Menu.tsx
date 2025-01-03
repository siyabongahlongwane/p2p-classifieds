import "./Menu.css";
import MenuItem from "../MenuItem/MenuItem";
import { useEffect } from 'react';
import { HomeOutlined, LocalShippingOutlined, LogoutOutlined, MarkChatUnreadOutlined, SettingsOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { MenuItem as MenuItemType } from "../../typings/MenuItem.type";
import { useStore } from "../../stores/store";

const Menu = () => {
    const { setField, activeMenuItem } = useStore();

    const menuItems: MenuItemType[] = [
        {
            Icon: HomeOutlined,
            route: 'home',
            label: 'Home',
        },
        {
            Icon: ShoppingBagOutlined,
            route: 'my-shop',
            label: 'My Shop',
        },
        {
            Icon: LocalShippingOutlined,
            route: 'orders/my-orders',
            label: 'Orders',
        },
        {
            Icon: MarkChatUnreadOutlined,
            route: 'messages',
            label: 'Messages',
        },
        {
            Icon: SettingsOutlined,
            route: 'settings',
            label: 'Settings',
        },
        {
            Icon: LogoutOutlined,
            label: 'Logout',
            route: '',
            logout: useAuth().logout
        },
    ]

    useEffect(() => {
        const activeMenuItem = localStorage.getItem('activeMenuItem') ? parseInt(localStorage.getItem('activeMenuItem') as string) : 0;
        setField('activeMenuItem', activeMenuItem);
    }, []);

    return (
        <div className='menu'>
            {
                menuItems.map((item, index) => <MenuItem key={index} item={item} index={index} activeMenuItem={activeMenuItem} setActiveMenuItem={setField} />)
            }
        </div>
    )
}

export default Menu