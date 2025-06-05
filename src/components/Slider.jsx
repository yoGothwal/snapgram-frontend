import { Typography, Box, Slider } from "@mui/material";

import { useState } from "react";

export default function SliderSizes({ setRadius }) {
  const [value, setValue] = useState(10);
  const handleChange = (event, newValue) => {
    console.log("setting radius: ", newValue);
    setValue(newValue);
    setRadius(newValue);
  };
  return (
    <Box sx={{ width: 100 }}>
      <Slider
        value={value}
        onChange={handleChange}
        min={1}
        max={100}
        color="red"
        valueLabelDisplay="auto"
      />
      <Typography>Set Distance</Typography>
    </Box>
  );
}
