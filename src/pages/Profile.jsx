// import { useNavigate } from "react-router-dom";
// import { Box, Avatar, Typography, Button, Paper, Grid } from "@mui/material";
// import { useRef } from "react";
// import { clearUser, setUser } from "../features/userSlice";
// import { useDispatch, useSelector } from "react-redux";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// const Item = ({ children }) => {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         px: 2,
//         height: "100%",
//         boxSizing: "border-box",
//       }}
//     >
//       {children}
//     </Paper>
//   );
// };

// // Helper function to format numbers
// const formatNumber = (num) => {
//   if (num >= 1000000) {
//     return (num / 1000000).toFixed(1) + "m";
//   }
//   if (num >= 1000) {
//     return (num / 1000).toFixed(1) + "k";
//   }
//   return num.toString();
// };

// const Profile = () => {
//   const user = useSelector((state) => state.user.user);
//   const token = useSelector((state) => state.user.token);
//   const coords = useSelector((state) => state.user.coords);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fileInputRef = useRef();

//   if (!user) return null;

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       dispatch(
//         setUser({
//           user: { ...user, profilePicture: ev.target.result },
//           token,
//           coords,
//         })
//       );
//     };
//     reader.readAsDataURL(file);
//   };

//   // Mock user photos data - replace with your actual data
//   const userPhotos = Array(30).fill(null); // Creates an array of 9 items

//   return (
//     <Box sx={{ justifyContent: "center" }}>
//       <Grid container spacing={0} sx={{ mt: 4 }}>
//         <Grid item xs={12} md={6}>
//           <Item>
//             <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
//               <Box
//                 sx={{
//                   gap: 1,
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <Box onClick={() => fileInputRef.current.click()}>
//                   <Avatar
//                     src={user.profilePicture || "/src/images/user_dp.png"}
//                     alt="Profile"
//                     sx={{
//                       width: 60,
//                       height: 60,
//                       mb: 1,
//                     }}
//                   />
//                 </Box>

//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={fileInputRef}
//                   style={{ display: "none" }}
//                   onChange={handleImageChange}
//                 />
//               </Box>
//               <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     minWidth: 60,
//                   }}
//                 >
//                   <Typography variant="body2" fontWeight="bold">
//                     {formatNumber(user.postsCount || 0)}
//                   </Typography>
//                   <Typography variant="body2">posts</Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     minWidth: 60,
//                   }}
//                 >
//                   <Typography variant="body2" fontWeight="bold">
//                     {formatNumber(user.followersCount || 0)}
//                   </Typography>
//                   <Typography variant="body2">followers</Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     minWidth: 60,
//                   }}
//                 >
//                   <Typography variant="body2" fontWeight="bold">
//                     {formatNumber(user.followingCount || 0)}
//                   </Typography>
//                   <Typography variant="body2">following</Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </Item>
//         </Grid>

//         <Grid item xs={12}>
//           <Item>
//             <Box sx={{ display: "flex" }}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontWeight: "bold",
//                   fontFamily: "'Pacifico', cursive",
//                   mb: 1,
//                 }}
//               >
//                 {user.name}
//               </Typography>
//               <KeyboardArrowDownIcon
//                 onClick={() => {
//                   dispatch(clearUser());
//                   localStorage.removeItem("snapgram_user");
//                   navigate("/login");
//                 }}
//               >
//                 Log Out
//               </KeyboardArrowDownIcon>
//             </Box>
//             <Typography
//               variant="body2"
//               sx={{ color: "#555", fontStyle: "italic", mb: 0 }}
//             >
//               {user.bio} This is user bioThis is user bioThis is user bio
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ color: "#232526", fontWeight: "bold" }}
//             >
//               @{user.username}
//             </Typography>
//           </Item>
//         </Grid>
//       </Grid>

//       {/* Instagram-style photo grid */}
//       <Grid container spacing={0.5} sx={{ mt: 4, px: 0 }}>
//         {userPhotos.map((_, index) => (
//           <Grid item xs={4} key={index}>
//             <Box
//               sx={{
//                 aspectRatio: "1/1",
//                 backgroundColor: "black",
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "white",
//               }}
//             >
//               <Typography>Photo {index + 1}</Typography>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Profile;
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
import { useRef } from "react";
import { clearUser, setUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { PhotoCamera, MoreVert, Edit } from "@mui/icons-material";

const ProfileCard = ({ children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        // border: "1px solid #e0e0e0",
        // borderRadius: "8px",
        // backgroundColor: "transparent",
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
  const coords = useSelector((state) => state.user.coords);
  const followings = useSelector((state) => state.connection.followings);
  const followers = useSelector((state) => state.connection.followers);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  console.log(user);
  const handleEditProfile = () => {
    navigate(`/profile/edit`);
  };
  const handleFollowerCountClick = () => {
    console.log("clicked");
    navigate(`/connections/${user.username}`);
  };

  if (!user) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch(
        setUser({
          user: { ...user, profilePicture: ev.target.result },
          token,
          coords,
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const userContent = Array(12).fill(null);

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 2, mt: 4 }}>
      {/* Profile Info */}
      <ProfileCard>
        {/* Top Section - Profile Picture and User Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          {/* Profile Picture - Always top left */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user.profilePicture || "/src/images/user_dp.png"}
              alt="Profile"
              sx={{
                width: 100,
                height: 100,
                border: "2px solid #000",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Box>

          {/* User Info - Top right on desktop, below DP on mobile */}
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
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                {user.name}
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton size="small">
                  <Edit fontSize="small" />
                </IconButton>
                <Tooltip title="Log Out">
                  <IconButton size="small">
                    <KeyboardArrowDownIcon
                      onClick={() => {
                        dispatch(clearUser());
                        localStorage.removeItem("snapgram_user");
                        navigate("/login");
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>

        {/* Bio - Full width below both sections */}
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            mb: 2,
            wordBreak: "break-word",
            width: "100%",
          }}
        >
          {user.bio || "No biography added yet."}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Stats - Centered below */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <StatItem value={user.postsCount || 0} label="PUBLICATIONS" />
          <StatItem
            onClick={handleFollowerCountClick}
            value={followers.length || 0}
            label="CONNECTIONS"
          />
          <StatItem
            onClick={handleFollowerCountClick}
            value={followings.length || 0}
            label="FOLLOWING"
          />
        </Box>
      </ProfileCard>

      {/* Content Grid */}
      {/* <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        YOUR CONTENT
      </Typography> */}
      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
        <Button
          onClick={handleEditProfile}
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
          EDIT PROFILE
        </Button>
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
