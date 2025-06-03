import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
        p: 2,
        justifyContent: "flex-start", // align logo to the left
        backgroundColor: "white",
        zIndex: 1300,
        borderBottom: "1px solid #232526",
        // background:
        //   "linear-gradient(90deg,rgb(255, 255, 255) 1%, #232526 100%)",

        //boxShadow: 6,
        //borderRadius: 4,
        //background: "rgba(35,37,38,0.85)", // dark glass effect
        // border: "1px solid rgba(255,215,100,0.25)", // subtle gold border
      }}
    >
      <Typography
        onClick={() => navigate("/dashboard")}
        variant="h5"
        align="left"
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          color: "black",
          letterSpacing: 2,
          fontStyle: "italic",
          fontWeight: "bold",
          fontFamily: "cursive,'Pacifico'",
          textTransform: "uppercase",
        }}
      >
        SnapGram
      </Typography>
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
