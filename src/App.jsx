import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { auth, provider, signInWithPopup } from "./firebase";
import axios from "axios";

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
  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <>
          <img
            src={user.profilePic || user.profilePicture}
            alt="Profile"
            width={80}
          />
          <p>Name: {user.name}</p>
          <p>Bio: {user.bio}</p>
        </>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [nearby, setNearby] = useState([]);

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    const profile = result.user;

    const coords = { lat: 28.61, lng: 77.23 };

    const res = await axios.post(
      "http://localhost:5000/api/users/register",
      {
        name: profile.displayName,
        bio: "Using SnapGram 😎",
        lat: coords.lat,
        lng: coords.lng,
        profilePic: profile.photoURL,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUser({ ...res.data, token, profilePic: profile.photoURL });
  };

  const fetchNearby = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/users/nearby?lat=28.61&lng=77.23&radius=10`,
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
    <Router>
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
    </Router>
  );
}

export default App;
