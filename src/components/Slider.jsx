import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function SliderSizes() {
  return (
    <Box sx={{ width: 100, zIndex: 1, mt: 2, p: 4 }}>
      <Slider defaultValue={50} valueLabelDisplay="auto" />{" "}
      <Typography>Set Distance</Typography>
    </Box>
  );
}
