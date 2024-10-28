import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import AppWrapper from "./components/AppWrapper/AppWrapper";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/my-shop" element={<Home />}></Route>
            <Route path="/messages" element={<Home />}></Route>
            <Route path="/settings" element={<Home />}></Route>
          </Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
