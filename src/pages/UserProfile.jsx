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
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFollowings } from "../features/connectionSlice";
import ImageMessage from "../components/ImageMessage";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
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
  const [expandedCaptions, setExpandedCaptions] = useState({});

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
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/posts/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched posts", res.data);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching  posts:", error);
    }
  };
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

  const fetchLikedPosts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/likes/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("liked posts:", res.data);
      setLikedPosts(res.data);
    } catch (error) {
      console.error("error fetching liked posts: ", error);
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    fetchUser();
    fetchPosts();
    fetchLikedPosts();
  }, [user, token]);
  const increaseLike = async (postId) => {
    const body = {
      userId: user._id,
      postId,
    };
    try {
      const res = await axios.post(`${baseURL}/api/likes`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikedPosts((prev) => [...prev, postId]);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likesCount: p.likesCount + 1 } : p
        )
      );
      console.log(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const decreaseLike = async (postId) => {
    try {
      const res = await axios.delete(`${baseURL}/api/likes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: user._id,
          postId,
        },
      });
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likesCount: p.likesCount - 1 } : p
        )
      );
      console.log(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  if (!user || !fetchedUser) return null;

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

  return (
    <>
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 1, mt: 2 }}>
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
              }}
            >
              FOLLOW
            </Button>
          )}
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={2000}
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1400, // above modals
            backgroundColor: "transparent",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
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
        spacing={1}
        sx={{
          mt: 1,
          mb: 10,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {posts?.map((post) => (
          <Grid item xs={6} sm={12} key={post._id}>
            <Card
              elevation={0}
              sx={{
                maxWidth: 350,
                borderRadius: 0,
                backgroundColor: "#fafafa",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image */}
              <ImageMessage imageUrl={post.image}>
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={post.image}
                    alt="Post content"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              </ImageMessage>

              {/* Caption and Likes */}
              <CardContent sx={{ p: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      likedPosts?.includes(post._id)
                        ? decreaseLike(post._id)
                        : increaseLike(post._id)
                    }
                  >
                    {likedPosts?.includes(post._id) ? (
                      <FavoriteIcon sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <Typography variant="body2">
                    {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
                  </Typography>
                </Box>

                {post.caption && (
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#333",

                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: expandedCaptions[post._id]
                          ? undefined
                          : 1,
                        flex: 1,
                        minWidth: 0, // Prevents overflow
                      }}
                    >
                      {post.caption}
                    </Typography>
                    {post.caption.length > 50 && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          color: "grey",
                          cursor: "pointer",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          alignSelf: "flex-end",

                          ml: 0.5,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCaptions((prev) => ({
                            ...prev,
                            [post._id]: !prev[post._id],
                          }));
                        }}
                      >
                        {expandedCaptions[post._id] ? "less" : "more"}
                      </Typography>
                    )}
                  </Box>
                )}
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    alignSelf: "flex-end",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    mt: 0.5,
                    letterSpacing: 0.1,
                    whiteSpace: "nowrap", // Prevents line breaks
                  }}
                >
                  {new Date(post.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default UserProfile;
