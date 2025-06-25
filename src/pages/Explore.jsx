import { Box, Grid, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

const Explore = () => {
  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          mt: 4,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Array(11)
          .fill(null)
          .map((_, index) => (
            <Grid item xs={6} key={index}>
              <Box
                sx={{
                  minHeight: { xs: 170, sm: 250, md: 300 },
                  aspectRatio: "1/1",
                  backgroundColor: "rgba(0,0,0,0.05)",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {index + 1}
                </Typography>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    color: "black",
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
      </Grid>
    </>
  );
};
export default Explore;
