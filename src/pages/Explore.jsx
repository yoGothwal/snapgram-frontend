import { Box, Avatar, Typography, Paper } from "@mui/material";
const gradients = [
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
  "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
];
const animalImages = [
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256",
  "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=facearea&w=256&h=256",
];

const images = Array.from({ length: 50 }, (_, i) => {
  if (i % 3 === 0) {
    return `https://randomuser.me/api/portraits/men/${(i % 25) + 1}.jpg`;
  } else if (i % 3 === 1) {
    return `https://randomuser.me/api/portraits/women/${(i % 25) + 1}.jpg`;
  } else {
    return animalImages[i % animalImages.length];
  }
});
const colors = Array.from(
  { length: 50 },
  (_, i) => gradients[i % gradients.length]
);
const Explore = () => {
  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: "auto",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          justifyContent: "center",
          borderRadius: 4,
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            justifyItems: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {colors.map((color, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                src={images[idx]}
                variant="square"
                alt={`Profile ${idx + 1}`}
                sx={{ width: "100%", height: "100%" }}
                referrerPolicy="no-referrer"
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Explore;
