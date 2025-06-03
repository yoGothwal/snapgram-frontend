import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/NavBar";
import Logo from "./components/Logo";

import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import FindPeople from "./pages/FindPeople";

import { auth, provider, signInWithPopup } from "./firebase";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "/api";

function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("snapgram_user");
    return saved ? JSON.parse(saved) : null;
  });
  useEffect(() => {
    if (user) {
      localStorage.setItem("snapgram_user", JSON.stringify(user));
    }
  }, [user]);

  const navigate = useNavigate();

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
          setUser({ ...res.data, token, coords });
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

  if (!user) {
    return (
      <div>
        <button onClick={signIn}>Sign In with Google</button>
      </div>
    );
  }

  return (
    <>
      <Logo></Logo>
      <Navbar setUser={setUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/explore" />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/find-people" element={<FindPeople user={user} />} />
        <Route
          path="/profile"
          element={<Profile user={user} setUser={setUser} />}
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
