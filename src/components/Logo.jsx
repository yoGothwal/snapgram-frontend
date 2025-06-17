import { Typography, Box, Popover, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { useSelector } from "react-redux";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const Content = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const a = 0;
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/users/notifications`, {
        withCredentials: true,
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
      await axios.put(`${baseURL}/api/users/notifications/${n._id}/seen`, {
        withCredentials: true,
      });
      navigate(`/${n.from.username}`);
    } catch (err) {
      console.error("Error marking notification as seen:", err);
      navigate(`/${n.from.username}`); // fallback
    }
  };
  const openChat = () => {
    navigate("/chat");
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
        onClick={() => navigate("/explore")}
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
        <MessageIcon onClick={openChat} sx={{ fontSize: 25 }}></MessageIcon>
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
          PaperProps={{
            sx: {
              backgroundColor: "white",
              boxShadow: "none",
            },
          }}
        >
          {notifications.filter((n) => !n.seen).length === 0 ? (
            <Typography sx={{ p: 2 }}>No new notifications</Typography>
          ) : (
            notifications
              //mongo.filter((n) => !n.seen)
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
                    backgroundColor: "white",
                    border: "1px solid #eee",
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <Avatar
                    src={n.from.profilePicture}
                    alt={n.from.username}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2">
                    <strong>{n.from.username}</strong>{" "}
                    {n.type === "follow"
                      ? "started following you"
                      : n.type === "like"
                        ? "liked your post"
                        : n.message}
                  </Typography>
                </Box>
              ))
          )}
        </Popover>
      </Box>
    </Box>
  );
};
const Logo = () => {
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
        <Content />
      </Box>
    </Box>
  );
};

export default Logo;
