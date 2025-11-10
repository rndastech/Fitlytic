import React, { useState } from "react";
import { IconButton, Modal, Box, Typography, Button } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

/**
 * HelpModal Component
 *
 * This component renders an informational modal to assist users with exercise instructions, specifically
 * for providing guidance on camera placement. It includes a question mark icon button that, when clicked,
 * opens a modal containing an instructional video, image, and text.
 *
 * @component
 * @param {string} image - The URL of the image to display in the modal, typically depicting camera placement instructions.
 * @param {string} description - The text providing instructions and guidance on camera placement.
 *
 * @returns {JSX.Element} - Returns a modal component that can be triggered by a question mark icon button.
 */
function HelpModal({ image, description, video }) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      <IconButton
        onClick={handleOpenModal}
        sx={{ 
          position: "relative", 
          gap: "3px", 
          color: "#d4af37",
          "&:hover": {
            color: "#e8c547",
            transform: "scale(1.1)",
          },
        }}>
        <QuestionMarkIcon fontSize="small" />
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>Help</Typography>
      </IconButton>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw",
            height: "80vh",
            background: "rgba(26, 26, 46, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
            boxShadow: "0px 0px 40px 0px rgba(212, 175, 55, 0.3)",
            p: 4,
            borderRadius: "16px",
            textAlign: "center",
            color: "#ffffff",
          }}>
          <Typography 
            id="modal-modal-title" 
            variant="h3" 
            sx={{ 
              mb: "1.5rem",
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
            }}>
            Video Tutorial
          </Typography>
          <iframe
            width="100%"
            src={video}
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: "12px",
              aspectRatio: "16/9",
              marginBottom: "2rem",
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}></iframe>
          <Typography 
            id="modal-modal-title" 
            variant="h3" 
            sx={{ 
              mb: "1.5rem",
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
            }}>
            Camera Placement Instructions
          </Typography>
          <Box
            component="img"
            src={image}
            sx={{
              width: "80%",
              mb: "1.5rem",
              borderRadius: "12px",
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}
          />
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ 
              color: "#b0b0b0", 
              mb: "1.5rem",
              lineHeight: 1.6,
            }}>
            {description}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleCloseModal}
            sx={{
              px: "2.5rem",
              py: "0.75rem",
              background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
              color: "#0a0e27",
              fontWeight: 700,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                transform: "translateY(-2px)",
              },
            }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default HelpModal;
