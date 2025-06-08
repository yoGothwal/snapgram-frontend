// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Avatar,
//   Typography,
//   Paper,
//   Button,
//   Snackbar,
//   Alert,
//   Grid,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// const baseURL = import.meta.env.VITE_API_URL || "/api";

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

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.user.user);
//   const token = useSelector((state) => state.user.token);
//   const [fetchedUser, setFetchedUser] = useState(null);
//   const { username } = useParams();

//   const [isFollowing, setIsFollowing] = useState(false);

//   console.log("Fetched user: ", fetchedUser);
//   const [notification, setNotification] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/users/${username}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const u = res.data;
//       console.log(u);
//       setFetchedUser(u);
//       // Check if current user is following this user
//       setIsFollowing(u.isFollowing);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       // Only fetch if user is available
//       fetchUser();
//     }
//   }, [username, user]);

//   // Sometimes you have are setting useState to null. Then it might be possible that it will show error in starting. Like const [v,setV] = useState(null)
//   // Then you need something like if(!v) return <p> loading<p></p>
//   if (!user || !fetchedUser) return null;

//   const handleFollow = async () => {
//     try {
//       await axios.post(
//         `${baseURL}/api/users/follow/${fetchedUser.user._id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setIsFollowing(true);
//       // Update the local state to reflect the new follower
//       setFetchedUser((prev) => ({
//         ...prev,
//         isFollowing: true,
//       }));
//       setNotification({
//         open: true,
//         message: `You are now following ${fetchedUser.user.username}`,
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Error following user:", error);
//       setNotification({
//         open: true,
//         message: `Failed to follow user`,
//         severity: "error",
//       });
//     }
//   };

//   const handleUnfollow = async () => {
//     try {
//       await axios.post(
//         `${baseURL}/api/users/unfollow/${fetchedUser.user._id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setIsFollowing(false);
//       // Update the local state to remove the follower
//       setFetchedUser((prev) => ({
//         ...prev,
//         isFollowing: false, // Fixed typo: was set to true
//       }));
//       setNotification({
//         open: true,
//         message: `Unfollowed ${fetchedUser.user.username}`,
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Error unfollowing user:", error);
//       setNotification({
//         open: true,
//         message: `Failed to unfollow user`,
//         severity: "error",
//       });
//     }
//   };

//   const handleChatClick = () => {
//     console.log("clicked chat");
//     navigate(`/chat/${fetchedUser.user.username}`);
//   };

//   return (
//     <Box sx={{ justifyContent: "center" }}>
//       <Grid container spacing={0} sx={{ mt: 4 }}>
//         <Grid item xs={12} md={6}>
//           <Item>
//             <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
//               <Box sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
//                 <Avatar
//                   src={
//                     fetchedUser.user.profilePicture || "/src/images/user_dp.png"
//                   }
//                   alt="Profile"
//                   sx={{
//                     width: 60,
//                     height: 60,
//                     mb: 1,
//                   }}
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
//                     {formatNumber(fetchedUser.user.postsCount || 0)}
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
//                     {formatNumber(fetchedUser.user.followersCount || 0)}
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
//                     {formatNumber(fetchedUser.user.followingCount || 0)}
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
//                 {fetchedUser.user.name}
//               </Typography>
//             </Box>
//             <Typography
//               variant="body2"
//               sx={{ color: "#555", fontStyle: "italic", mb: 0 }}
//             >
//               {fetchedUser.user.bio || "No bio yet"}
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ color: "#232526", fontWeight: "bold" }}
//             >
//               @{fetchedUser.user.username}
//             </Typography>
//           </Item>
//         </Grid>
//       </Grid>

//       <Box sx={{ display: "flex", justifyContent: "center", mt: 2, px: 2 }}>
//         {isFollowing ? (
//           <Box sx={{ display: "flex", gap: 2, width: "100%", maxWidth: 400 }}>
//             <Button
//               onClick={handleUnfollow}
//               variant="outlined"
//               fullWidth
//               sx={{
//                 color: "black",
//                 borderColor: "black",
//                 border: 2,
//                 borderRadius: 2,
//                 fontWeight: "bold",
//               }}
//             >
//               Unfollow
//             </Button>
//             <Button
//               onClick={handleChatClick}
//               variant="outlined"
//               fullWidth
//               sx={{
//                 color: "black",
//                 borderRadius: 2,
//                 borderColor: "black",
//                 border: 2,
//                 fontWeight: "bold",
//               }}
//             >
//               Message
//             </Button>
//           </Box>
//         ) : (
//           <Button
//             onClick={handleFollow}
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{
//               fontWeight: "bold",
//               borderRadius: 2,
//               maxWidth: 400,
//             }}
//           >
//             Follow
//           </Button>
//         )}
//       </Box>

//       {/* Instagram-style photo grid */}
//       <Grid container spacing={1} sx={{ mt: 4, px: 1 }}>
//         {Array(9)
//           .fill(null)
//           .map((_, index) => (
//             <Grid item xs={4} key={index}>
//               <Box
//                 sx={{
//                   aspectRatio: "1/1",
//                   backgroundColor: "black",
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "white",
//                 }}
//               >
//                 <Typography>Photo {index + 1}</Typography>
//               </Box>
//             </Grid>
//           ))}
//       </Grid>

//       <Snackbar
//         open={notification.open}
//         autoHideDuration={3000}
//         onClose={() => setNotification({ ...notification, open: false })}
//       >
//         <Alert severity={notification.severity}>{notification.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default UserProfile;
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
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MoreVert } from "@mui/icons-material";
import { setFollowings } from "../features/connectionSlice";

const baseURL = import.meta.env.VITE_API_URL || "/api";

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

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const followings = useSelector((state) => state.connection.followings);

  const { username } = useParams();

  const [fetchedUser, setFetchedUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [count, setCount] = useState({
    flwrCount: 0,
    flwnCount: 0,
  });
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = res.data;
      console.log("Fetched user", res.data);
      setFetchedUser(u);
      // setCount({
      //   flwrCount: res.data.user.followerCount,
      //   flwnCount: res.data.user.followingCount,
      // });
      setIsFollowing(u.isFollowing);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [username, user]);

  if (!user || !fetchedUser) return null;

  const handleFollow = async () => {
    try {
      await axios.post(
        `${baseURL}/api/users/follow/${fetchedUser.user._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchUser();
      const updatedFollowings = [...followings, fetchedUser.user];
      dispatch(setFollowings(updatedFollowings));
      setIsFollowing(true);
      // setCount({
      //   flwrCount: flwrCount + 1,
      //   flwnCount,
      // });
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchUser();
      const updatedFollowings = followings.filter(
        (f) => f._id !== fetchedUser.user._id
      );
      dispatch(setFollowings(updatedFollowings));
      setIsFollowing(false);
      // setCount({
      //   flwrCount: flwrCount - 1,
      //   flwnCount,
      // });
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
    navigate(`/${fetchedUser.user.username}/connections`);
  };
  const handleChatClick = () => {
    navigate(`/chat/${fetchedUser.user.username}`);
  };
  const userContent = Array(9).fill(null);

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 2, mt: 4 }}>
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
            <Avatar
              src={fetchedUser.user.profilePicture || "/src/images/user_dp.png"}
              alt="Profile"
              sx={{
                width: 100,
                height: 100,
                border: "2px solid #000",
              }}
            />
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
                mb: 2,
                wordBreak: "break-word",
                width: "100%",
              }}
            >
              {fetchedUser.user.bio || "No biography added yet."}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Stats Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <StatItem
            value={fetchedUser.user.postsCount || 0}
            label="PUBLICATIONS"
          />
          <StatItem
            onClick={handleFollowingClick}
            value={fetchedUser.user.followerCount || 0}
            label="CONNECTIONS"
          />
          <StatItem
            onClick={handleFollowingClick}
            value={fetchedUser.user.followingCount || 0}
            label="FOLLOWING"
          />
        </Box>
      </ProfileCard>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
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
              width: "100%",
              maxWidth: 400,
            }}
          >
            FOLLOW
          </Button>
        )}
      </Box>

      {/* Content Grid */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {userContent.map((_, index) => (
          <Grid item xs={6} key={index}>
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

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
