import { Box, Button, TextField } from "@mui/material";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ImageMessage from "./ImageMessage";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL || "/api";
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const ProfilePostForm = () => {
  const token = useSelector((state) => state.user.token);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef();
  const navigate = useNavigate();
  const uploadPost = async () => {
    if (!selectedImage) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage.file);
      formData.append("caption", caption);

      const response = await axios.post(`${baseURL}/api/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upload successful:", response.data);
      setSelectedImage(null);
      setCaption("");
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
      navigate("/profile");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="What's on your mind?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        sx={{ mb: 2 }}
      />

      {selectedImage?.preview && (
        <Box sx={{ mb: 2, position: "relative" }}>
          <img
            src={selectedImage.preview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "4px",
            }}
          />
        </Box>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputFileRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            alert("Please provide a valid image format (JPEG, PNG, WEBP, GIF)");
            return;
          }

          if (file.size > MAX_IMAGE_SIZE) {
            alert("Image size must be below 10MB");
            return;
          }

          setSelectedImage({
            file,
            preview: URL.createObjectURL(file),
          });
        }}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        {!selectedImage ? (
          <Button
            variant="contained"
            onClick={() => inputFileRef.current.click()}
          >
            Upload Image
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedImage(null);
                if (inputFileRef.current) {
                  inputFileRef.current.value = "";
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={uploadPost}
              disabled={isUploading}
            >
              {isUploading ? "Posting..." : "Post"}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePostForm;
