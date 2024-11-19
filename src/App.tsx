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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route path="home" element={<Home />}></Route>
            <Route path="cart" element={<Cart />}></Route>
            <Route path="likes" element={<Likes />}></Route>
            <Route path="my-shop" element={<MyShop />}>
              <Route path="add-product" element={<AddProduct />}></Route>
            </Route>
            <Route path="messages" element={<Home />}></Route>
            <Route path="settings" element={<Home />}></Route>
            <Route
              path="/view-product/:product_id"
              element={<ViewProduct />}
            ></Route>
          </Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
