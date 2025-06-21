import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";
import { setUser } from "./features/userSlice";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Navbar from "./components/NavBar";
import ProfileEditForm from "./components/ProfileEditForm";

import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Explore from "./pages/Explore";
import FindPeople from "./pages/FindPeople";
import Chat from "./pages/Chat";
import UserChat from "./pages/UserChat";

import { auth, provider, signInWithPopup } from "./firebase";
import axios from "axios";

import LoginPage from "./pages/LoginPage";
import Connections from "./pages/Connections";
import { setFollowers, setFollowings } from "./features/connectionSlice";

const baseURL = import.meta.env.VITE_API_URL || "/api";

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("snapgram_user"));

    if (savedUser) {
      dispatch(setUser(savedUser));
    } else {
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  const fetchConnections = async (username) => {
    try {
      const res = await axios.get(`${baseURL}/api/connections/${username}`, {
        withCredentials: true,
      });
      const { followers, followings } = res.data;
      dispatch(setFollowers(followers));
      dispatch(setFollowings(followings));
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  };
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        }
      );
    });
  };
  const registerUser = async (profile, coords) => {
    try {
      const profilePicture =
        profile.photoURL || "https://via.placeholder.com/150";

      const res = await axios.post(
        `${baseURL}/api/auth/register`,
        {
          name: profile.displayName,
          bio: "Using SnapGram 😎",
          lat: coords.lat,
          lng: coords.lng,
          profilePicture: profilePicture,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      console.log("Registration error");
      throw error;
    }
  };
  const a = 0;
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const profile = result.user;
      const token = await profile.getIdToken();

      try {
        console.log(token);
        await axios.post(
          `${baseURL}/api/auth/sessionLogin`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const coords = await getLocation();
        const userData = await registerUser(profile, coords);
        await fetchConnections(userData.username);
        const user = {
          user: userData,
          coords,
        };
        dispatch(setUser(user));
        localStorage.setItem("snapgram_user", JSON.stringify(user));
        console.log("Logged-in: ", user);
        navigate("/explore");
      } catch (error) {
        console.error("Error after authentication:", error);
        alert("Failed to complete setup. Please try again.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage signIn={signIn} />} />{" "}
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/find-people"
          element={
            <>
              <Navbar />
              <FindPeople />
            </>
          }
        />
        <Route
          path="/connections/:username"
          element={
            <>
              <Navbar />
              <Connections />
            </>
          }
        />
        <Route path="/chat/:username" element={<UserChat />} />
        <Route element={<Layout></Layout>}>
          <Route path="/" element={<Navigate to="/explore" />} />
          <Route
            path="/explore"
            element={
              <>
                <Navbar />
                <Explore />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
          <Route
            path="/:username"
            element={
              <>
                <Navbar />
                <UserProfile />
              </>
            }
          />
        </Route>
        <Route
          path="/profile/edit"
          element={
            <>
              <ProfileEditForm />
            </>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

// import React, { useEffect, useRef, useState } from "react";

// const App = () => {
//   const [time, setTime] = useState(0);
//   const [inputVal, setInputVal] = useState("");
//   const [on, setOn] = useState(false);
//   const timeRef = useRef();
//   const startTimer = () => {
//     const val = parseInt(inputVal);

//     const startTime = Date.now();
//     const duration = val;

//     localStorage.setItem("startTime", startTime);
//     localStorage.setItem("duration", duration);

//     clearInterval(timeRef.current);
//     setTime(val);
//     setOn(true);
//     timeRef.current = setInterval(() => {
//       const remaining = val - Math.floor((Date.now() - startTime) / 1000);
//       if (remaining <= 0) {
//         clearInterval(timeRef.current);
//         localStorage.removeItem("duration");
//         localStorage.removeItem("startTime");
//         setTime(0);
//       } else {
//         setTime(remaining);
//       }
//     }, 1000);
//   };
//   useEffect(() => {
//     const earlierStart = localStorage.getItem("startTime");
//     const earlierDuration = localStorage.getItem("duration");
//     if (earlierDuration && earlierStart) {
//       const remaining =
//         parseInt(earlierDuration) -
//         Math.floor((Date.now() - parseInt(earlierStart)) / 1000);
//       if (remaining > 0) {
//         setTime(remaining);
//         setOn(true);
//         timeRef.current = setInterval(() => {
//           const remainingNow =
//             parseInt(earlierDuration) -
//             Math.floor((Date.now() - parseInt(earlierStart)) / 1000);
//           if (remainingNow <= 0) {
//             clearInterval(timeRef.current);
//             setTime(0);
//             localStorage.removeItem("duration");
//             localStorage.removeItem("startTime");
//           } else {
//             setTime(remainingNow);
//           }
//         }, 1000);
//       } else {
//         localStorage.removeItem("duration");
//         localStorage.removeItem("startTime");
//         setTime(0);
//       }
//     }
//   }, []);
//   return (
//     <div>
//       <h2>{on && time === 0 ? "Time's up" : time}</h2>
//       <input
//         type="text"
//         placeholder="enter seconds"
//         value={inputVal}
//         onChange={(e) => setInputVal(e.target.value)}
//       />
//       <button onClick={startTimer}>Start</button>
//     </div>
//   );
// };

// export default App;
