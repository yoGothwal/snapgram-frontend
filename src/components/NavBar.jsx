import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProfileIcon from "@mui/icons-material/Person";
import ExploreIcon from "@mui/icons-material/Explore";

import { useNavigate } from "react-router-dom";
function NavBar() {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          p: 2,
          justifyContent: "center",
          backgroundColor: "white",
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            gap: 10,
            px: "50px",
            justifyContent: "center",
            border: "1px solid #232526",
            borderRadius: 5,
          }}
        >
          <Box
            onClick={() => navigate("/explore")}
            sx={{ cursor: "pointer", mt: 1 }}
          >
            <ExploreIcon
              sx={{
                color: "#232526",
                fontSize: 30,
                cursor: "pointer",
              }}
            ></ExploreIcon>
          </Box>
          <Box
            onClick={() => navigate("/find-people")}
            sx={{ cursor: "pointer", mt: 1 }}
          >
            <SearchIcon
              sx={{
                color: "#232526",
                fontSize: 30,
                cursor: "pointer",
              }}
            ></SearchIcon>
          </Box>
          <Box
            onClick={() => navigate("/profile")}
            sx={{ cursor: "pointer", mt: 1 }}
          >
            <ProfileIcon
              sx={{
                color: "#232526",
                fontSize: 30,
                cursor: "pointer",
              }}
            ></ProfileIcon>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default NavBar;
