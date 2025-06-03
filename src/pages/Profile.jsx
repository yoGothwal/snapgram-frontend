import { useNavigate } from "react-router-dom";
import { Box, Avatar, Typography, Button, Paper } from "@mui/material";
import { useRef } from "react";

const Profile = ({ user, setUser, place }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  if (!user) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUser({ ...user, profilePicture: ev.target.result });
      // Optionally, save to localStorage or backend here
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)",
        width: "100vw",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          justifyContent: "center",
          borderRadius: 4,
          width: "100%",
          maxWidth: 400,
          background: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box onClick={() => fileInputRef.current.click()}>
            <Avatar
              src={user.profilePicture || "/src/images/user_dp.png"}
              alt="Profile"
              sx={{
                width: 80,
                height: 80,
                mb: 1,
              }}
            />
          </Box>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontFamily: "'Pacifico', cursive" }}
          >
            {user.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "#232526" }}>
            @{user.username}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#555", fontStyle: "italic" }}
          >
            {user.bio}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2, borderRadius: 2, fontWeight: "bold" }}
            onClick={() => {
              setUser(null);
              localStorage.removeItem("snapgram_user");
              navigate("/explore");
            }}
          >
            Log Out
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
