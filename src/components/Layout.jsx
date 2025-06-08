import Logo from "../components/Logo";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <Logo />

    <Outlet></Outlet>
  </>
);

export default Layout;
