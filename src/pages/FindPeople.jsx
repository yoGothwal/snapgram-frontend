import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { NoBgSx } from "../sx/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import Lottie from "lottie-react";
import gpsGlow from "../assets/gpsGlow.json";
import LocationSlider from "../components/Slider";
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
  TextField,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const FindPeople = ({ user }) => {
  const navigate = useNavigate();
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsOn, setGpsOn] = useState(false);
  const [radius, setRadius] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchNearby = useCallback(async () => {
    console.log("searching for within: ", radius);
    if (!user?.coords) {
      alert("Location not available.");
      return;
    }
    setLoading(true);
    const { lat, lng } = user.coords;
    const delay = new Promise((resolve) => setTimeout(resolve, 1000));
    const apiCall = axios.get(
      `${baseURL}/api/users/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const [res] = await Promise.all([apiCall, delay]);
    console.log("users", res.data);
    setNearby(res.data);
    setLoading(false);
  }, [user, radius]);

  useEffect(() => {
    fetchNearby();
  }, [radius, fetchNearby]);

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          await axios.put(
            `${baseURL}/api/users/update-location`,
            { lat, lng },
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          setGpsOn(true);
          user.coords = { lat, lng };
          fetchNearby();
        } catch (err) {
          console.error("Location update failed:", err);
          alert("Failed to update location");
        }
      },
      (error) => {
        console.error("Location fetch error:", error);
        alert("Unable to fetch location");
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (gpsOn) {
      updateLocation();
    }
  }, [gpsOn]);

  const handlePersonClick = (u) => {
    console.log("clicked");
    navigate(`/users/${u.username}`);
  };

  const filteredUsers = nearby.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          mt: { xs: 4, sm: 4 },
          width: "100%",
          background: "white",
          position: "relative",
        }}
      >
        {/* Search Box */}
        <Box
          sx={{
            p: 2,
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                  borderRadius: "24px",
                },
                borderRadius: "24px",
              },
            }}
          />
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Collapsible Filters Box */}
        <Collapse in={showFilters}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              borderTop: "1px solid #f0f0f0",
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: "#fafafa",
            }}
          >
            {/* GPS Section */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, color: "#555" }}
              >
                Location Services
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#777", textAlign: "center", mb: 1 }}
              >
                {gpsOn
                  ? "GPS is active - showing real-time location updates"
                  : "Enable GPS for accurate nearby results"}
              </Typography>
              <Box sx={{ position: "relative" }}>
                {gpsOn && (
                  <Lottie
                    animationData={gpsGlow}
                    loop
                    autoplay
                    style={{
                      position: "absolute",
                      width: 60,
                      height: 60,
                      top: -10,
                      left: -10,
                      zIndex: 0,
                    }}
                  />
                )}
                <IconButton
                  onClick={() => setGpsOn(!gpsOn)}
                  sx={{
                    color: gpsOn ? "#3a86ff" : "action.active",
                    zIndex: 1,
                    p: 1.5,
                  }}
                >
                  {gpsOn ? (
                    <GpsFixedIcon fontSize="medium" />
                  ) : (
                    <GpsNotFixedIcon fontSize="medium" />
                  )}
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ width: "100%", px: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, color: "#555", mb: 1 }}
              >
                Search Radius: {radius} km
              </Typography>
              <LocationSlider setRadius={setRadius} />
            </Box>
          </Box>
        </Collapse>

        <List sx={{ pt: loading ? 0 : 0 }}>
          {filteredUsers.length === 0 && !loading && (
            <Typography
              variant="body2"
              sx={{ color: "#888", textAlign: "center", mt: 2 }}
            >
              No nearby users found.
            </Typography>
          )}
          {filteredUsers.map((u) => (
            <ListItem
              key={u.uid}
              sx={{ mb: 1 }}
              onClick={() => handlePersonClick(u)}
            >
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
