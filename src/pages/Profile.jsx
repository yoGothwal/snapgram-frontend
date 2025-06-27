import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Drawer,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Edit } from "@mui/icons-material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import axios from "axios";
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
      <Typography variant="caption" color="text.secondary" onClick={onClick}>
        {label}
      </Typography>
    </Box>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const [profileData, setProfileData] = useState(null);

  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/posts/${user.username}`, {
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
      const res = await axios.get(`${baseURL}/api/users/${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const u = res.data;
      console.log("Fetched profile", res.data);
      setProfileData(u);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    console.log("Expanded captions:", expandedCaptions);
  }, [expandedCaptions]);

  const postComment = async () => {
    if (comment.trim() === "") return;
    const res = await axios.post(
      `${baseURL}/api/comments/`,
      { userId: user._id, postId: selectedPost, comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data);
    setComment("");
    fetchComments(selectedPost);
  };
  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${baseURL}/api/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(res.data);
      console.log("fetched comments:", res.data);
    } catch (error) {
      console.log("error in fetching comments:", error);
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

  const handleEditProfile = () => {
    navigate(`/profile/edit`, { state: { user, token } });
  };
  const handleFollowerCountClick = () => {
    navigate(`/connections/${profileData?.user.username || "username"}`);
  };
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
  const handleLogout = async () => {
    dispatch(clearUser());
    localStorage.removeItem("snapgram_user");
    navigate("/login");
  };
  const handlePost = () => {
    navigate(`/profile/create`);
  };
  return (
    <>
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 1, mt: 2 }}>
        <ProfileCard>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <ImageMessage
                imageUrl={
                  profileData?.user.profilePicture || "/src/images/user_dp.png"
                }
              >
                <Avatar
                  src={
                    profileData?.user.profilePicture ||
                    "/src/images/user_dp.png"
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

            <Box
              sx={{
                flexGrow: 1,
                width: "100%",

                display: "flex",
                flexDirection: "column",
              }}
            >
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
                  {profileData?.user.name || "adam"}
                </Typography>

                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton size="small" onClick={handleEditProfile}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <Tooltip title="Log Out">
                    <IconButton size="small">
                      <KeyboardArrowDownIcon onClick={handleLogout} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                @{profileData?.user.username || "username"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  mb: 2,
                  wordBreak: "break-word",
                  width: "100%",
                }}
              >
                {profileData?.user.bio || "No biography added yet."}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: 1,
              mt: 1,
            }}
          >
            <StatItem
              onClick={handleFollowerCountClick}
              value={profileData?.user.followerCount || 0}
              label="FOLLOWERS"
            />
            <StatItem
              onClick={handleFollowerCountClick}
              value={profileData?.user.followingCount || 0}
              label="FOLLOWING"
            />
            <StatItem value={user.postsCount || 0} label="POSTS" />
          </Box>{" "}
          <Divider sx={{ my: 1 }} />
        </ProfileCard>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handlePost}
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            NEW POST
          </Button>
        </Box>
      </Box>
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

              <CardContent sx={{ p: 1.5 }}>
                {/* Caption and Likes */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    {post.likesCount || ""}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{ mt: 0.3, ml: 1 }}
                    onClick={() => {
                      setDrawerOpen(true);
                      setSelectedPost(post._id);
                      fetchComments(post._id);
                    }}
                  >
                    <ModeCommentOutlinedIcon></ModeCommentOutlinedIcon>
                  </IconButton>
                  <Typography variant="body2">
                    {post.commentsCount || ""}
                  </Typography>

                  {/*drawer */}
                  <Drawer
                    anchor="bottom"
                    open={drawerOpen}
                    onClose={() => {
                      setDrawerOpen(false);
                      setSelectedPost(null);
                    }}
                    PaperProps={{
                      sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      },
                    }}
                  >
                    <Box
                      p={2}
                      sx={{
                        height: "90vh",
                        overflowY: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <ExpandMoreOutlinedIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedPost(null);
                            setDrawerOpen(false);
                          }}
                        />
                      </Box>
                      {/* Comments list here */}
                      {comments?.map((comment) => (
                        <Box
                          key={comment._id}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            mb: 2,
                          }}
                        >
                          <Avatar
                            src={comment.user.profilePicture}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600 }}
                            >
                              {comment.user.username}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: "pre-wrap" }}
                            >
                              {comment.content}
                            </Typography>
                          </Box>
                        </Box>
                      ))}

                      <Box></Box>
                      <Box
                        mt={2}
                        sx={{
                          display: "flex",
                          position: "fixed",
                          bottom: "80px",
                          left: 0,
                          right: 0,
                          gap: 1,
                          justifyContent: "center",
                          px: 2, // optional padding
                        }}
                      >
                        <TextField
                          fullWidth
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          variant="outlined"
                          size="small"
                          placeholder="😊 Add a comment..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 4,
                            },
                          }}
                        />

                        <Button
                          onClick={postComment}
                          sx={{
                            backgroundColor: "black",
                            color: "white",
                            height: 40,
                            borderRadius: 4,
                          }}
                        >
                          <ArrowUpwardOutlinedIcon></ArrowUpwardOutlinedIcon>
                        </Button>
                      </Box>
                    </Box>
                  </Drawer>
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

export default Profile;
