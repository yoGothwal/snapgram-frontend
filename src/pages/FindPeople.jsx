import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { NoBgSx } from "../sx/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

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
} from "@mui/material";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const FindPeople = ({ user }) => {
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsOn, setGpsOn] = useState(false);
  const [radius, setRadius] = useState(10);

  const fetchNearby = useCallback(async () => {
    console.log("searching for within: ", radius);
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
      `${baseURL}/api/users/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    // Wait for both to finish
    const [res] = await Promise.all([apiCall, delay]);
    console.log("users", res.data);
    setNearby(res.data);
    setLoading(false);
  }, [user]);

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
          user.coords = { lat, lng }; // update local user coords
          fetchNearby();
        } catch (err) {
          console.error("Location update failed:", err);
          alert("Failed to update locatio");
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
        <Box
          sx={{
            zIndex: 1600,
            background: "white",
            p: 2,
            border: "2px solid red",
          }}
        >
          <LocationSlider setRadius={setRadius}></LocationSlider>
        </Box>
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

            {/* gps  */}
            <Box
              onClick={() => setGpsOn(!gpsOn)}
              sx={{
                position: "fixed",
                top: 20,
                right: 30,
                zIndex: 1500,
              }}
            >
              <Box sx={{ position: "relative", width: 60, height: 60 }}>
                {gpsOn && (
                  <Lottie
                    animationData={gpsGlow}
                    loop
                    autoplay
                    style={{
                      position: "absolute",
                      top: -17,
                      left: 25,
                      width: "100%",
                      height: "100%",
                      zIndex: 0,
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: "absolute",
                    color: "blue",

                    top: 15,
                    left: 55,
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                  }}
                >
                  {gpsOn ? (
                    <GpsFixedIcon sx={{ fontSize: 30 }} />
                  ) : (
                    <GpsNotFixedIcon sx={{ fontSize: 30 }} />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FindPeople;
