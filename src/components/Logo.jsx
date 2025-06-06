import { Typography, Box, Popover, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const Content = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/users/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(res.data);
    } catch (e) {
      console.log("error fetching", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleNotificationIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationIconClose = () => {
    setAnchorEl(null);
  };
  const handleNotificationClick = async (n) => {
    setAnchorEl(null);
    try {
      await axios.put(
        `${baseURL}/api/users/notifications/${n._id}/seen`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      navigate(`/users/${n.from.username}`);
    } catch (err) {
      console.error("Error marking notification as seen:", err);
      navigate(`/users/${n.from.username}`); // fallback
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        p: 1,
        justifyContent: "space-between",
        backgroundColor: "white",
        zIndex: 1300,
      }}
    >
      <Typography
        onClick={() => navigate("/dashboard")}
        variant="h5"
        align="left"
        sx={{
          fontSize: "2rem",
          color: "black",
          letterSpacing: 2,
          fontStyle: "italic",
          fontWeight: "bold",
          fontFamily: "cursive,'Pacifico'",
        }}
      >
        SnapGram
      </Typography>
      <Box mx={2} my={1} sx={{ display: "flex", gap: 1 }}>
        <MessageIcon sx={{ fontSize: 25 }}></MessageIcon>
        <Box onClick={handleNotificationIconClick}>
          <NotificationsIcon sx={{ fontSize: 25 }}></NotificationsIcon>
        </Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleNotificationIconClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {notifications.filter((n) => !n.seen).length === 0 ? (
            <Typography sx={{ p: 2 }}>No new notifications</Typography>
          ) : (
            notifications
              .filter((n) => !n.seen)
              .map((n) => (
                <Box
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <Avatar
                    src={n.from.profilePicture}
                    alt={n.from.username}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2">
                    <strong>{n.from.username}</strong> started following you
                  </Typography>
                </Box>
              ))
          )}
        </Popover>
      </Box>
    </Box>
  );
};
const Logo = ({ user }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "sticky",

          zIndex: 1000,
          width: "100%",
          height: 20,
        }}
      >
        <Content user={user} />
      </Box>
    </Box>
  );
};

export default Logo;
