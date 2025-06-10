import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";
import { setUser } from "./features/userSlice";

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
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import Connections from "./pages/Connections";
import { setFollowers, setFollowings } from "./features/connectionSlice";

const baseURL = import.meta.env.VITE_API_URL || "/api";

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      localStorage.setItem("snapgram_user", JSON.stringify(user));
    } else {
      navigate("/login", { replace: true });
    }
  }, [user]);

  const fetchConnections = async (token, username) => {
    try {
      const res = await axios.get(`${baseURL}/api/connections/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { followers, followings } = res.data;
      dispatch(setFollowers(followers));
      dispatch(setFollowings(followings));
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  };
  const registerUser = async (profile, coords, token) => {
    try {
      const profilePicture =
        profile.photoURL || "https://via.placeholder.com/150";

      const res = await axios.post(
        `${baseURL}/api/users/register`,
        {
          name: profile.displayName,
          bio: "Using SnapGram 😎",
          lat: coords.lat,
          lng: coords.lng,
          profilePicture: profilePicture,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Logged-in: ", res.data);
      return res.data;
    } catch (error) {
      console.log("Registration error");
      throw error;
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

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const profile = result.user;
      const token = await profile.getIdToken();

      try {
        const coords = await getLocation();
        const userData = await registerUser(profile, coords, token);
        await fetchConnections(token, userData.username);
        dispatch(
          setUser({
            user: userData,
            token,
            coords,
          })
        );
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
