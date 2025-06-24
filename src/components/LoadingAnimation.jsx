import { Box, Typography } from "@mui/material";
const LoadingAnimation = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        width: 300,
        textAlign: "center",
      }}
    >
      {/* Pixel art inspired dots */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 12,
              height: 12,
              backgroundColor: "primary.main",
              borderRadius: "50%",
              animation: `pulse 1s ease-in-out infinite ${i * 0.2}s`,
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.7 },
                "50%": { transform: "scale(1.3)", opacity: 1 },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
