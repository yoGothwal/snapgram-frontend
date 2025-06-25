import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MoreVert } from "@mui/icons-material";
import { setFollowings } from "../features/connectionSlice";
import ImageMessage from "../components/ImageMessage";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const ProfileCard = ({ children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
      }}
    >
      {children}
    </Paper>
  );
};

const StatItem = ({ value, label, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{ textAlign: "center", minWidth: "60px", cursor: "pointer" }}
    >
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  if (!user || !token) return null;

  const followings = useSelector((state) => state.connection.followings);

  const [fetchedUser, setFetchedUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { username } = useParams();
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/users/${username}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const u = res.data;
      console.log("Fetched user", res.data);
      setFetchedUser(u);

      setIsFollowing(u.isFollowing);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, []);

  if (!user || !fetchedUser) return null;
  console.log("DP URL:", fetchedUser.user.profilePicture);

  const handleFollow = async () => {
    try {
      await axios.post(
        `${baseURL}/api/users/follow/${fetchedUser.user._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUser();
      const updatedFollowings = [...followings, fetchedUser.user];
      dispatch(setFollowings(updatedFollowings));
      setIsFollowing(true);
      setFetchedUser((prev) => ({
        ...prev,
        isFollowing: true,
      }));
      setNotification({
        open: true,
        message: `You are now following ${fetchedUser.user.username}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error following user:", error);
      setNotification({
        open: true,
        message: `Failed to follow user`,
        severity: "error",
      });
    }
  };
  const handleUnfollow = async () => {
    try {
      await axios.post(
        `${baseURL}/api/users/unfollow/${fetchedUser.user._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUser();
      const updatedFollowings = followings.filter(
        (f) => f._id !== fetchedUser.user._id
      );
      dispatch(setFollowings(updatedFollowings));
      setIsFollowing(false);
      setFetchedUser((prev) => ({
        ...prev,
        isFollowing: false,
      }));
      setNotification({
        open: true,
        message: `Unfollowed ${fetchedUser.user.username}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setNotification({
        open: true,
        message: `Failed to unfollow user`,
        severity: "error",
      });
    }
  };
  const handleFollowingClick = () => {
    navigate(`/connections/${fetchedUser.user.username}`);
  };
  const handleChatClick = () => {
    navigate(`/chat/${fetchedUser.user.username}`);
  };
  const userContent = Array(9).fill(null);

  return (
    <>
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 2, mt: 2 }}>
        {/* Profile Info */}
        <ProfileCard>
          {/* Profile Picture and User Info Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            {/* Profile Picture with Edit Button */}
            <Box sx={{ position: "relative" }}>
              <ImageMessage
                imageUrl={
                  fetchedUser.user.profilePicture || "/src/images/user_dp.png"
                }
              >
                <Avatar
                  src={
                    fetchedUser.user.profilePicture || "/src/images/user_dp.png"
                  }
                  alt="Profile"
                  sx={{
                    width: 100,
                    height: 100,
                    border: "2px solid #000",
                  }}
                />
              </ImageMessage>
            </Box>

            {/* User Info Section */}
            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {fetchedUser.user.name}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                @{fetchedUser.user.username}
              </Typography>

              {/* Bio Section - Full width */}
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  wordBreak: "break-word",
                  width: "100%",
                }}
              >
                {fetchedUser.user.bio || "No biography added yet."}
              </Typography>
            </Box>
          </Box>

          {/* Stats Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              mt: 3,
              gap: { xs: 1, sm: 2 },
            }}
          >
            <StatItem
              onClick={handleFollowingClick}
              value={fetchedUser.user.followerCount || 0}
              label="FOLLOWERS"
            />
            <StatItem
              onClick={handleFollowingClick}
              value={fetchedUser.user.followingCount || 0}
              label="FOLLOWING"
            />
            <StatItem value={fetchedUser.user.postsCount || 0} label="POSTS" />
          </Box>
          <Divider sx={{ my: 1 }} />
        </ProfileCard>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",

            gap: 2,
          }}
        >
          {isFollowing ? (
            <>
              <Button
                onClick={handleUnfollow}
                variant="outlined"
                sx={{
                  borderColor: "black",
                  color: "black",
                  "&:hover": {
                    borderColor: "black",
                    backgroundColor: "rgba(0,0,0,0.05)",
                  },
                }}
              >
                UNFOLLOW
              </Button>
              <Button
                onClick={handleChatClick}
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                MESSAGE
              </Button>
            </>
          ) : (
            <Button
              onClick={handleFollow}
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
                width: "100%",
                maxWidth: 400,
              }}
            >
              FOLLOW
            </Button>
          )}
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1400, // above modals
            backgroundColor: "transparent",
          }}
        >
          <Alert
            severity={notification.severity}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
      {/* Content Grid */}
      <Grid
        container
        spacing={2}
        sx={{
          mt: 1,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {userContent.map((_, index) => (
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

export default UserProfile;
