import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { auth, provider, signInWithPopup } from "./firebase";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "/api";

function Explore() {
  return <h2>Explore Page</h2>;
}

function FindPeople({ fetchNearby, nearby }) {
  return (
    <div>
      <button onClick={fetchNearby}>Find Nearby Users</button>
      <ul>
        {nearby.map((u) => (
          <li key={u.uid}>
            {u.name} - {u.bio}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Profile({ user, place }) {
  console.log("user", user);
  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <>
          <img
            src={user.profilePicture}
            alt="Profile"
            width={80}
            referrerPolicy="no-referrer"
          />
          <p>Name: {user.name}</p>
          <p>Bio: {user.bio}</p>
          <p>Username: {user.username}</p>
          <p>
            Location Coords: {user.coords.lng},{user.coords.lat},
          </p>
          <p>Place: {place}</p>
        </>
      )}
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [place, setPlace] = useState("");
  const getPlaceName = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setPlace(data.display_name || "Unknown location");
    } catch (e) {
      setPlace("Unknown location");
    }
  };
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
          console.log("User's location: [lat, lng]: ", coords);
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
          getPlaceName(coords.lat, coords.lng);
          navigate("/profile");
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

  const fetchNearby = async () => {
    if (!user?.coords) {
      alert("Location not available.");
      return;
    }
    const { lat, lng } = user.coords;
    const res = await axios.get(
      `${baseURL}/api/users/nearby?lat=${lat}&lng=${lng}&radius=10`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    setNearby(res.data);
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
      {/* Navigation Bar */}
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Link to="/explore">Explore</Link>
        <Link to="/findpeople">Find People Nearby</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Navigate to="/explore" />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/findpeople"
          element={<FindPeople fetchNearby={fetchNearby} nearby={nearby} />}
        />
        <Route
          path="/profile"
          element={<Profile user={user} place={place} />}
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
