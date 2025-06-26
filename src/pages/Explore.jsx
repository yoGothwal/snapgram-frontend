import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
} from "@mui/material";
import ImageMessage from "../components/ImageMessage";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_API_URL || "/api";

const Explore = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
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
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/posts/`, {
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
    fetchLikedPosts();
    fetchPosts();
  }, [user, token]);
  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          mt: 6,
          mb: 12,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
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
              <ImageMessage imageUrl={post.image}>
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box
                    onClick={() => navigate(`/${post.user.username}`)}
                    sx={{
                      position: "absolute",
                      top: 20,
                      left: 20,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                      backgroundColor: "rgb(255, 255, 255)", // Semi-transparent white
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        transform: "scale(1.2)",
                        transition: "0.5s ease ",
                      },
                    }}
                  >
                    <Avatar
                      src={
                        post.user.profilePicture ||
                        "https://randomuser.me/api/portraits/lego/1.jpg"
                      }
                      sx={{
                        width: 34,
                        height: 34,
                        border: "1px solid rgba(255,255,255,0.5)",
                      }}
                    />
                  </Box>
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
export default Explore;
