import { Box, Typography, Button, Paper, FormControl } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const LoginPage = ({ signIn }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <Typography variant="h4" color="primary" gutterBottom>
      Hello
    </Typography>
    <Paper elevation={2}>
      <FormControl>Email</FormControl>
    </Paper>
    <Typography>Or</Typography>
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={signIn}
      sx={{ textTransform: "none", fontSize: "1rem", px: 3, py: 1.5 }}
    >
      Sign in with Google
    </Button>
  </Box>
);

export default LoginPage;
