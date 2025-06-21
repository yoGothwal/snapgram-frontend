import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box, TextField, Button, Typography, Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const coords = useSelector((state) => state.user.coords);
  if (!user || !token) return null;

  const [form, setForm] = useState({
    name: "",
    bio: "",
    profilePicture: "",
  });
  console.log(form);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/users/${user.username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm({
          name: res.data.user.name,
          bio: res.data.user.bio || "",
          profilePicture: res.data.user.profilePicture || "",
        });
      } catch (err) {
        console.log("Error loading latest user:", err);
      }
    };

    if (user && token) fetchLatest();
  }, [user, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm({ ...form, profilePicture: ev.target.result });
    };
    reader.readAsDataURL(file);
  };
  const baseURL = import.meta.env.VITE_API_URL || "/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${baseURL}/api/users/${user.username}`,
        form,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      const newUser = res.data;
      dispatch(
        setUser({
          user: newUser,
          coords,
        })
      );
      navigate(`/profile`);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={form.profilePicture || "/default-profile.png"}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">@{user.username}</Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current.click()}
              startIcon={<PhotoCamera />}
            >
              Change Photo
            </Button>
          </Box>
        </Box>

        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate(`/profile`)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "black", color: "white" }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default EditProfile;
