import { Typography, Box, Slider } from "@mui/material";

import { useState } from "react";

export default function SliderSizes({ setRadius }) {
  const [value, setValue] = useState(10);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setRadius(newValue);
  };
  return (
    <Box sx={{ width: "auto" }}>
      <Slider
        value={value}
        onChange={handleChange}
        min={1}
        max={100}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}
