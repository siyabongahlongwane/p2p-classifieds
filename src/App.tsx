import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  const { loading } = useLoaderStore();
  return (
    <>
      {
        loading && <Loader />
      }
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route path="home" element={<Home />}></Route>
            <Route path="cart" element={<Cart />}></Route>
            <Route path="likes" element={<Likes />}></Route>
            <Route path="orders" element={<Orders />}>
              <Route path="my-orders" element={<MyOrders />}></Route>
              <Route path="customer-orders" element={<CustomerOrders />}></Route>
              <Route path="view-order/:order_id" element={<ViewOrder />}></Route>
              <Route path="thank-you" element={<OrderOutcome />}></Route>
              <Route path="failed-order" element={<OrderOutcome />}></Route>
              <Route path="canceled-order" element={<OrderOutcome />}></Route>
            </Route>
            <Route path="my-shop" element={<MyShop />}>
              <Route path="add-product" element={<AddProduct />}></Route>
              <Route path="edit-product/:product_id" element={<AddProduct />}></Route>
            </Route>
            <Route path="messages" element={<Home />}></Route>
            <Route path="settings" element={<Home />}></Route>
            <Route
              path="/view-product/:product_id"
              element={<ViewProduct />}
            ></Route>
            <Route path="shipping-details" element={<ShippingDetails />}></Route>
            <Route path="payment" element={<Payment />}></Route>
          </Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
