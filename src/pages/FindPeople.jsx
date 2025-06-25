import { useState, useEffect } from "react";
import axios from "axios";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useDebounce } from "../hooks/useDebounce";

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
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setUser } from "../features/userSlice";
const baseURL = import.meta.env.VITE_API_URL || "/api";

const FindPeople = () => {
  const user =
    useSelector((state) => state.user.user) ||
    JSON.parse(localStorage.getItem("snapgram_user"));
  const token = useSelector((state) => state.user.token);

  const coords = useSelector((state) => state.user.coords);
  const navigate = useNavigate();
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsOn, setGpsOn] = useState(false);
  const [radius, setRadius] = useState(10);
  const debouncedRadius = useDebounce(radius, 500);
  console.log(user);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchNearby = async () => {
    console.log("searching for within: ", radius);
    if (!coords) {
      alert("Location not available.");
      return;
    }
    setLoading(true);
    try {
      const { lat, lng } = coords;

      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      const apiCall = axios.get(
        `${baseURL}/api/users/nearby?lat=${lat}&lng=${lng}&radius=${debouncedRadius}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const [res] = await Promise.all([apiCall, delay]);

      const filteredNearby = res.data.filter((n) => n._id !== user._id);

      setNearby(filteredNearby);
      console.log("Nearby people:", filteredNearby);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, [debouncedRadius]);

  const updateLocation = async () => {
    console.log("updating...");
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(lat, lng);
        try {
          await axios.put(
            `${baseURL}/api/users/update-location`,
            { lat, lng },
            {
              withCredentials: true,
            }
          );
          setGpsOn(true);
          dispatch(setUser({ ...user, coords: { lat, lng } }));
          // user.coords = { lat, lng };
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
      const interval = setInterval(updateLocation, 3000);
      return () => clearInterval(interval);
    }
  }, [gpsOn]);
  const handlePersonClick = (u) => {
    console.log("clicked");
    navigate(`/${u.username}`);
  };

  const filteredUsers = nearby
    ? nearby.filter((u) => {
        const isNotCurrentUser = u.username !== user?.username;
        const matchesSearch = searchQuery
          ? u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        return isNotCurrentUser && matchesSearch;
      })
    : [];

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
        {/* Search Box */}
        <Box
          sx={{
            p: 1,
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            onClick={() => navigate(-1)}
            sx={{
              mr: 1,
              cursor: "pointer",
            }}
          >
            <ArrowBackIcon />
          </Box>
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
                      top: -6,
                      left: -6,
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

        <List>
          {filteredUsers.length === 0 && !loading && (
            <Typography
              variant="body2"
              sx={{ color: "#888", textAlign: "center", mt: 2 }}
            >
              No nearby users found.
            </Typography>
          )}
          {filteredUsers
            // .filter((u) => u._id != user?._id)
            .map((u) => (
              <ListItem
                key={u._id || u.uid || u.userId}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                }}
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
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      component="div"
                    >
                      @{u.username}
                    </Typography>
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
            <CircularProgress size={50} />
          </Box>
        )}
        {/* {!loading && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              sx={NoBgSx}
              disableRipple
              onClick={fetchNearby}
              disabled={loading}
            >
              <RefreshIcon sx={{ color: "#232526", fontSize: 30 }} />
            </IconButton>
          </Box>
        )} */}
      </Paper>
    </Box>
  );
};

export default FindPeople;
