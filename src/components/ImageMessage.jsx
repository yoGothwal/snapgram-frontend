import { useState } from "react";
import Modal from "@mui/material/Modal";

const ImageMessage = ({ imageUrl, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
      {/* Thumbnail Image */}
      {children}

      {/* Full Screen Modal */}
      <Modal
        open={open}
        onClose={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
          },
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
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
            alt="Full size"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageMessage;
