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
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        bottom: 0,
        width: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        py: 1,
        justifyContent: "center",
        backgroundColor: "white",
        zIndex: 1300,
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box
        sx={{
          width: { xs: "80%", md: "70%", lg: "60%" },
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          px: { xs: 1, sm: 2 },
          py: 1,
          border: "1px solid rgb(0, 0, 0)",
          borderRadius: 5,
          backgroundColor: "background.paper",
        }}
      >
        <IconButton
          sx={{
            ...NoBgSx,
            "&:hover": { transform: "scale(1.1)" },
            transition: "transform 0.2s ease",
          }}
          onClick={() => navigate("/explore")}
          disableRipple
          size="medium"
        >
          <ExploreIcon
            sx={{
              color: "#232526",
              fontSize: { xs: 26, sm: 28 },
            }}
          />
        </IconButton>

        <IconButton
          sx={{
            ...NoBgSx,
            "&:hover": { transform: "scale(1.1)" },
            transition: "transform 0.2s ease",
          }}
          onClick={() => navigate("/find-people")}
          disableRipple
          size="medium"
        >
          <SearchIcon
            sx={{
              color: "#232526",
              fontSize: { xs: 26, sm: 28 },
            }}
          />
        </IconButton>

        <IconButton
          sx={{
            ...NoBgSx,
            "&:hover": { transform: "scale(1.1)" },
            transition: "transform 0.2s ease",
          }}
          onClick={() => navigate("/profile")}
          disableRipple
          size="medium"
        >
          <ProfileIcon
            sx={{
              color: "#232526",
              fontSize: { xs: 26, sm: 28 },
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
}

export default NavBar;
