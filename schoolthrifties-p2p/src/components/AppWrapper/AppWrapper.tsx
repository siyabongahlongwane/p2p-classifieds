import { Stack } from "@mui/material";
import Sidenav from "../Sidenav/Sidenav";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

const AppWrapper = () => {
  return (
    <Stack display={"grid"} gridTemplateColumns={"250px auto"} height={"100%"}>
      <Sidenav />
      <Stack p={3} >
        <Header />
        <Stack className="separator" height={"1px"} width={"100%"} bgcolor={'#e4e4e4'} my={2}></Stack>
        <Outlet />
        <Footer />
      </Stack>
    </Stack>
  );
};

export default AppWrapper;
