import { useState } from "react";
import Modal from "@mui/material/Modal";

const ImageMessage = ({ imageUrl }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    console.log("Image clicked"); // Debugging
    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setOpen(false);
  };

  return (
    <div onClick={handleOpen} style={{ cursor: "pointer" }}>
      {/* Thumbnail Image */}
      <img
        src={imageUrl}
        alt="Click to enlarge"
        style={{
          maxWidth: "100%",
          maxHeight: "200px",
          borderRadius: "8px",
          marginTop: 8,
          display: "block", // Important for click handling
        }}
      />

      {/* Full Screen Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        BackdropProps={{
          style: { backgroundColor: "rgba(0,0,0,0.9)" },
        }}
      >
        <div
          onClick={handleClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            outline: "none",
          }}
        >
          <img
            src={imageUrl}
            alt="Full screen"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking image
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageMessage;
