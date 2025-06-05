import { useNavigate, useParams } from "react-router-dom";
import { Box, Avatar, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "/api";

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const [fetchedUser, setFetchedUser] = useState(null);
  const { username } = useParams();

  const fetchUser = async () => {
    const res = await axios.get(`${baseURL}/api/users/${username}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const u = res.data.user;
    console.log(u);
    setFetchedUser(u);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  if (!user || !fetchedUser) return null;

  return (
    <Box
      sx={{
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          m: 4,
          p: 4,
          justifyContent: "center",
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
          <Box>
            <Avatar
              src={fetchedUser.profilePicture || "/src/images/user_dp.png"}
              alt="Profile"
              sx={{
                width: 80,
                height: 80,
                mb: 1,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontFamily: "'Pacifico', cursive" }}
          >
            {fetchedUser.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "#232526" }}>
            @{fetchedUser.username}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#555", fontStyle: "italic" }}
          >
            {fetchedUser.bio}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
