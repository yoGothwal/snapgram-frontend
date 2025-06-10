import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
const BackIcon = () => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate(-1)}
      sx={{
        mr: 1,
        cursor: "pointer",
        position: "absolute",
        zIndex: 1,
      }}
    >
      <ArrowBackIcon />
    </Box>
  );
};

export default BackIcon;
