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

function Profile({ user }) {
  console.log(user);
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
        </>
      )}
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [nearby, setNearby] = useState([]);
  const navigate = useNavigate();

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    const profile = result.user;
    console.log("profile ", profile, profile.photoURL);
    const coords = { lat: 28.61, lng: 77.23 };
    const profilePicture =
      profile.photoURL || "https://via.placeholder.com/150";
    console.log("profilePicture ", profilePicture);
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
    console.log("User registered:", res.data);
    setUser({ ...res.data, token });
    navigate("/profile"); // Navigate after sign in
  };

  const fetchNearby = async () => {
    const res = await axios.get(
      `${baseURL}/api/users/nearby?lat=28.61&lng=77.23&radius=10`,
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
        <Route path="/profile" element={<Profile user={user} />} />
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
