import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const baseURL = import.meta.env.VITE_API_URL || "/api";

const StyledTab = styled(Tab)({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
});

const Connections = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const { username } = useParams();

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseURL}/api/connections/${username}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { followers, followings } = res.data;
      setFollowers(followers);
      setFollowings(followings);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handlePersonClick = (username) => {
    navigate(username === user.username ? `/profile` : `/${username}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          background: "white",
          position: "relative",
        }}
      >
        {/* Tabs */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box
            onClick={() => navigate(-1)}
            sx={{
              p: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowBackIcon />
          </Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              flex: 1,
              "& .MuiTabs-indicator": {
                backgroundColor: "#000",
              },
            }}
          >
            <StyledTab label="Followers" />
            <StyledTab label="Following" />
          </Tabs>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 4,
            }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            {/* Followers List */}
            {activeTab === 0 && (
              <List>
                {followers.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "#888", textAlign: "center", p: 2 }}
                  >
                    No followers yet
                  </Typography>
                ) : (
                  followers.map((connection) => (
                    <ListItem
                      key={connection._id}
                      sx={{
                        cursor: "pointer",
                        mb: 1,
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                      }}
                      onClick={() =>
                        handlePersonClick(connection.follower.username)
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={
                            connection.follower.profilePicture ||
                            "https://randomuser.me/api/portraits/lego/1.jpg"
                          }
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{ fontWeight: "bold", color: "#232526" }}
                            component="span"
                          >
                            {connection.follower.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            @{connection.follower.username}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            )}

            {/* Following List */}
            {activeTab === 1 && (
              <List>
                {followings.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "#888", textAlign: "center", p: 2 }}
                  >
                    Not following anyone yet
                  </Typography>
                ) : (
                  followings.map((connection) => (
                    <ListItem
                      key={connection._id}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                        mb: 1,
                      }}
                      onClick={() =>
                        handlePersonClick(connection.following.username)
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={
                            connection.following.profilePicture ||
                            "https://randomuser.me/api/portraits/lego/1.jpg"
                          }
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{ fontWeight: "bold", color: "#232526" }}
                            component="span"
                          >
                            {connection.following.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            @{connection.following.username}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Connections;
