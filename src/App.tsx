import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProductList from "./components/Products/ProductList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductList />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
