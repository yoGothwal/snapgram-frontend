import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { NoBgSx } from "../sx/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const FindPeople = ({ user }) => {
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNearby = useCallback(async () => {
    if (!user?.coords) {
      alert("Location not available.");
      return;
    }
    setLoading(true);
    const { lat, lng } = user.coords;
    // Promise that resolves after 1 second
    const delay = new Promise((resolve) => setTimeout(resolve, 1000));
    // API request
    const apiCall = axios.get(
      `${baseURL}/api/users/nearby?lat=${lat}&lng=${lng}&radius=10`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    // Wait for both to finish
    const [res] = await Promise.all([apiCall, delay]);
    setNearby(res.data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

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
          mt: { xs: 6, sm: 4 },

          width: "100%",
          background: "white",
          position: "relative",
        }}
      >
        {/* Spinner in the middle on top */}

        <List sx={{ pt: loading ? 0 : 0 }}>
          {nearby.length === 0 && !loading && (
            <Typography
              variant="body2"
              sx={{ color: "#888", textAlign: "center", mt: 2 }}
            >
              No nearby users found.
            </Typography>
          )}
          {nearby.map((u) => (
            <ListItem key={u.uid} sx={{ mb: 1 }}>
              <ListItemAvatar>
                <Avatar
                  src={
                    u.profilePicture ||
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
                    {u.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      component={"span"}
                    >
                      @{u.username}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        )}
        {!loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <IconButton
              sx={NoBgSx}
              disableRipple
              onClick={fetchNearby}
              disabled={loading}
            >
              <RefreshIcon sx={{ color: "#232526", fontSize: 30 }} />
            </IconButton>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FindPeople;
