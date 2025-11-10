import React from "react";
import { Typography, Box } from "@mui/material";
import { Target } from "lucide-react";

function About() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#ffffff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated background grid */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(90deg, #d4af37 1px, transparent 1px), linear-gradient(#d4af37 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: { xs: "2rem 1rem", md: "4rem 2rem" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Our Mission Section */}
        <Box sx={{ maxWidth: "1000px", mb: "4rem" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              px: "1rem",
              py: "0.5rem",
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "50px",
              mb: "1rem",
            }}
          >
            <Target size={16} style={{ color: "#d4af37" }} />
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#d4af37",
                letterSpacing: "0.5px",
              }}
            >
              Our Purpose
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: "2rem",
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            Our Mission
          </Typography>

          <Box
            sx={{
              background: "rgba(26, 26, 46, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "16px",
              padding: { xs: "1.5rem", md: "2.5rem" },
              textAlign: "left",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#b0b0b0",
                lineHeight: 1.8,
              }}
            >
              We are actively developing a web application to assess physical therapy techniques and
              athletic movements with computer vision. Key concepts of our mission are integrating human
              pose detection models with video data that can accurately, efficiently, and constantly
              identify the user's current body position, as well as provide real-time feedback and
              guidance for the user to maintain the correct form during different physical activities,
              based on physiological literature. Our application features a catalog of exercises that
              users can quickly navigate to select their desired exercise and immediately start making
              improvements simply by activating their device camera. We hope and aim to positively
              impact fitness, physical therapy, and rehabilitation by improving exercise safety and
              effectiveness.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default About;
