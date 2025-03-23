import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import AppWrapper from "./components/AppWrapper/AppWrapper";
import Cart from "./pages/Cart/Cart";
import Likes from "./pages/Likes/Likes";
import MyShop from "./pages/MyShop/MyShop";
import AddProduct from "./pages/AddProduct/AddProduct";
import ViewProduct from "./pages/ViewProduct/ViewProduct";
import ShippingDetails from "./pages/ShippingDetails/ShippingDetails";
import Payment from "./pages/Payment/Payment";
import OrderOutcome from "./components/OrderOutcome/OrderOutcome";
import Orders from "./pages/Orders/Orders";
import MyOrders from "./pages/Orders/MyOrders";
import CustomerOrders from "./pages/Orders/CustomerOrders";
import ViewOrder from "./pages/Orders/ViewOrder";
import Loader from "./components/Loader/Loader";
import useLoaderStore from "./stores/useLoaderStore";
import useToastStore from "./stores/useToastStore";
import Toast from "./components/Toast/Toast";
import NotFound from "./components/NotFound/NotFound";
import Wallet from "./components/Wallet/Wallet";
import UserShop from "./components/UserShop/UserShop";
import Settings from "./pages/Settings/Settings";
import ChatApp from "./pages/Messages/Messages";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/User/UserContext";
import socket from "./utils/socket";
import GlobalSearch from "./components/GlobalSearch/GlobalSearch";

function App() {
  const { loading } = useLoaderStore();
  const { isOpen } = useToastStore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      //  Ensure socket is connected and mark user as online
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit('userOnline', user.user_id);
    }

    return () => {
      //  Keep socket connection alive unless user logs out
      if (!user) {
        socket.disconnect();
      }
    };
  }, [user]);

  return (
    <>
      {loading && <Loader />}
      {isOpen && <Toast />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route path="" element={<Navigate to="home" />} />
            <Route path="home" element={<Home />} />
            <Route path="shops/:shop_link" element={<UserShop />} />
            <Route path="cart" element={<Cart />} />
            <Route path="likes" element={<Likes />} />
            <Route path="/search" element={<GlobalSearch />} />
            <Route path="orders" element={<Orders />}>
              <Route path="" element={<Navigate to="./my-orders" />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="customer-orders" element={<CustomerOrders />} />
              <Route path="view-order" element={<ViewOrder />}>
                <Route path="" element={<Navigate to="./orders" />} />
                <Route path=":order_id" element={<ViewOrder />} />
              </Route>
              <Route path="thank-you" element={<OrderOutcome />} />
              <Route path="failed-order" element={<OrderOutcome />} />
              <Route path="canceled-order" element={<OrderOutcome />} />
            </Route>
            <Route path="my-shop" element={<MyShop />}>
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:product_id" element={<AddProduct />} />
            </Route>
            <Route path="messages" element={<ChatApp />} />
            <Route path="messages/:chat_id" element={<ChatApp />} />

            <Route path="my-wallet" element={<Wallet />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/view-product/:product_id" element={<ViewProduct />} />
            <Route path="shipping-details" element={<ShippingDetails />} />
            <Route path="payment" element={<Payment />} />
            {/* <Route path="*" element={<Navigate to="/not-found" />} /> */}
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
