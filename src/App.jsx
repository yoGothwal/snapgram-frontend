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

const baseURL = import.meta.env.VITE_API_URL || "/api";

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  console.log("User: ", user);
  useEffect(() => {
    if (user) {
      localStorage.setItem("snapgram_user", JSON.stringify(user));
    }
  }, [user]);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const profile = result.user;
      const token = await profile.getIdToken();
      //console.log("profile ", profile);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          //console.log("User's location: [lat, lng]: ", coords);
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
          //console.log("User registered:", res.data);
          // setUser({ ...res.data, token, coords });
          dispatch(
            setUser({
              user: res.data,
              token,
              coords,
            })
          );
          navigate("/explore");
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to get your location. Please allow location access.");
        }
      );
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, []);

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
          <Route
            path="/connections/:username"
            element={
              <>
                <Navbar />
                <Connections />
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
