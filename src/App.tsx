import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProductList from "./components/Products/ProductList";
import SignIn from "./pages/Auth/SignIn";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductList />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
