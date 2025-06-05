import { useNavigate, useParams } from "react-router-dom";
import { Box, Avatar, Typography, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "/api";

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const [fetchedUser, setFetchedUser] = useState(null);
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/users/${username}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const u = res.data.user;
      setFetchedUser(u);
      // Check if current user is following this user
      setIsFollowing(u.followers.includes(user._id));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      // Only fetch if user is available
      fetchUser();
    }
  }, [username, user]);

  if (!user || !fetchedUser) return null;

  const handleFollow = async () => {
    try {
      await axios.post(
        `${baseURL}/api/users/follow/${fetchedUser._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setIsFollowing(true);
      // Update the local state to reflect the new follower
      setFetchedUser((prev) => ({
        ...prev,
        followers: [...prev.followers, user._id],
      }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(
        `${baseURL}/api/users/unfollow/${fetchedUser._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setIsFollowing(false);
      // Update the local state to remove the follower
      setFetchedUser((prev) => ({
        ...prev,
        followers: prev.followers.filter((id) => id !== user._id),
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

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

          {isFollowing ? (
            <Button onClick={handleUnfollow} variant="outlined" color="error">
              Unfollow
            </Button>
          ) : (
            <Button onClick={handleFollow} variant="contained" color="primary">
              Follow
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
