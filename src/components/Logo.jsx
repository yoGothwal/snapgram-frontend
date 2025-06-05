import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
const Content = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",

        p: 1,
        justifyContent: "space-between", // align logo to the left
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
        <NotificationsIcon sx={{ fontSize: 25 }}></NotificationsIcon>
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
