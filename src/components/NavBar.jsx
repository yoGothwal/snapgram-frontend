import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProfileIcon from "@mui/icons-material/Person";
import ExploreIcon from "@mui/icons-material/Explore";

import IconButton from "@mui/material/IconButton";

import { useNavigate } from "react-router-dom";

import { NoBgSx } from "../sx/styles";

function NavBar() {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          width: "100%",
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
            width: "100%",
            mx: { xs: 50, sm: 10, md: 30, lg: 60 },
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            gap: 10,
            px: "20px",
            justifyContent: "center",
            border: "1px solid rgb(0, 0, 0)",
            borderRadius: 5,
          }}
        >
          <IconButton
            sx={NoBgSx}
            onClick={() => navigate("/explore")}
            disableRipple
          >
            <ExploreIcon sx={{ color: "#232526", fontSize: 30 }} />
          </IconButton>

          <IconButton
            sx={NoBgSx}
            onClick={() => navigate("/find-people")}
            disableRipple
          >
            <SearchIcon sx={{ color: "#232526", fontSize: 30 }} />
          </IconButton>
          <IconButton
            sx={NoBgSx}
            onClick={() => navigate("/profile")}
            disableRipple
          >
            <ProfileIcon sx={{ color: "#232526", fontSize: 30 }} />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export default NavBar;
