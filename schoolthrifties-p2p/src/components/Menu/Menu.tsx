import "./Menu.css";
import MenuItem from "../MenuItem/MenuItem";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { Dashboard, HomeOutlined, LocalShippingOutlined, Lock, LogoutOutlined, MarkChatUnreadOutlined, Money, SettingsOutlined, ShoppingBagOutlined, WalletOutlined } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { MenuItem as MenuItemType } from "../../typings/MenuItem.type";
import { useStore } from "../../stores/store";
import { UserContext } from "../../context/User/UserContext";

const Menu = () => {
    const { setField, activeMenuItem, filteredMenuItems } = useStore();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const roles = {
        1: 'Admin',
        2: 'Shop Manager',
        3: 'Parent',
    }

    const isLoggedIn = user !== null;
    const isParent = isLoggedIn && JSON.parse(user.roles).includes(3);

    // Routes
    const [menuItems] = useState<MenuItemType[]>([
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
            Icon: WalletOutlined,
            route: 'my-wallet',
            label: 'My Wallet',
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
    ]);

    // Use useMatch to match static and dynamic routes
    const homeMatch = useMatch('/home');
    const myShopMatch = useMatch('/my-shop');
    const ordersMatch = useMatch('/orders/my-orders');
    const messagesMatch = useMatch('/messages');
    const walletMatch = useMatch('/my-wallet');
    const settingsMatch = useMatch('/settings');
    const ordersViewMatch = useMatch('/orders/view-order/*');
    const myShopEditMatch = useMatch('/my-shop/edit-product/*');
    const messagesChatMatch = useMatch('/messages/*');

    useEffect(() => {
        // Initialize active route based on current location
        let matchedRouteIndex = -1;

        // Check for static route matches first
        if (homeMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'home');
        } else if (myShopMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'my-shop');
        } else if (ordersMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'orders/my-orders');
        } else if (messagesMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'messages');
        } else if (walletMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'my-wallet');
        } else if (settingsMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'settings');
        }

        // Check for dynamic routes (i.e., orders/view-order/:id or my-shop/edit-product/:id)
        if (ordersViewMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'orders/my-orders');
        } else if (myShopEditMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'my-shop');
        } else if (messagesChatMatch) {
            matchedRouteIndex = menuItems.findIndex(item => item.route === 'messages');
        }

        // If a match is found, set the active menu item
        if (matchedRouteIndex !== -1) {
            setField('activeMenuItem', matchedRouteIndex);
            localStorage.setItem('activeMenuItem', matchedRouteIndex.toString());
        }
    }, [location, menuItems, setField]);


    useEffect(() => {
        if (user && isParent) {
            console.log('Is Parent');
            setField('filteredMenuItems', [...menuItems]);
        } else if (user && JSON.parse(user.roles).includes(1)) {
            console.log('Is Admin');
            const filteredItems = [
                {
                    Icon: Dashboard,
                    route: 'home',
                    label: 'Dashboard',
                },
                {
                    Icon: Money,
                    route: 'sign-in',
                    label: 'Payouts',
                },
                {
                    ...menuItems.slice().pop()
                }
            ]
            setField('filteredMenuItems', filteredItems);
        } else {
            console.log('Not logged in');
            const filteredItems = [
                {
                    ...menuItems.slice().shift()
                },
                {
                    Icon: Lock,
                    route: 'sign-in',
                    label: 'Sign In',
                }
            ]
            setField('filteredMenuItems', filteredItems);
        }
    }, [user]);

    return (
        <div className='menu'>
            {
                filteredMenuItems.map((item, index) => <MenuItem key={index} item={item} index={index} activeMenuItem={activeMenuItem} setActiveMenuItem={setField} />)
            }
        </div>
    );
};

export default Menu;
