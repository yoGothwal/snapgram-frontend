import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect } from "react";
import { clearUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { MoreVert, Edit } from "@mui/icons-material";
import axios from "axios";
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
    <Box onClick={onClick} sx={{ textAlign: "center", px: 1 }}>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [profileData, setProfileData] = useState(null);
  console.log(token);
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
    fetchUser();
  }, [user, token]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(`/profile/edit`, { state: { user, token } });
  };
  const handleFollowerCountClick = () => {
    navigate(`/connections/${profileData.user.username}`);
  };

  if (!user || !profileData) return null;

  const handleLogout = async () => {
    dispatch(clearUser());
    localStorage.removeItem("snapgram_user");
    navigate("/login");
  };
  const userContent = Array(12).fill(null);

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 2, mt: 2 }}>
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
            <Avatar
              src={profileData.user.profilePicture || "/src/images/user_dp.png"}
              alt="Profile"
              sx={{
                width: 100,
                height: 100,
                border: "2px solid #000",
              }}
            />
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
                {profileData.user.name}
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
              @{profileData.user.username}
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
              {profileData.user.bio || "No biography added yet."}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <StatItem
            onClick={handleFollowerCountClick}
            value={profileData.user.followerCount || 0}
            label="CONNECTIONS"
          />
          <StatItem
            onClick={handleFollowerCountClick}
            value={profileData.user.followingCount || 0}
            label="FOLLOWING"
          />
          <StatItem value={user.postsCount || 0} label="PUBLICATIONS" />
        </Box>
      </ProfileCard>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
        <Button
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
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {userContent.map((_, index) => (
          <Grid item xs={6} md={4} key={index}>
            <Box
              sx={{
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
    </Box>
  );
};

export default Profile;
