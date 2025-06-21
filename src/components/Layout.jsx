import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { Outlet } from "react-router-dom";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "/api";
import { useSelector } from "react-redux";
const Layout = () => {
  const [notifications, setNotifications] = useState([]);
  const token = useSelector((state) => state.user.token);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/users/notifications`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(res.data);
    } catch (e) {
      console.log("error fetching", e);
    }
  };
  useEffect(() => {
    if (token) fetchNotifications();
  }, []);
  return (
    <>
      <Logo notifications={notifications} />

      <Outlet></Outlet>
    </>
  );
};

export default Layout;
