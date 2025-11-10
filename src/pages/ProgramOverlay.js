import React, { useState, useEffect } from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, List, Loader } from "lucide-react";
import { loadExerciseData } from "./exercises/ExercisePageData"; // Assuming this loads exercise data dynamically
import ExercisePage from "./exercises/ExercisePage"; // The new dynamic exercise page

function ProgramOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProgram = [] } = location.state || {};
  const [index, setIndex] = useState(0);
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (currentProgram.list.length === 0) {
      setError(true);
      setLoading(false);
      console.error("Error: Program is empty or undefined.");
      return;
    }

    const currentExercise = currentProgram.list[index];
    if (!currentExercise) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    loadExerciseData(currentExercise)
      .then((data) => {
        setExerciseData(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [index, currentProgram.list]);

  const handleNavigate = () => {
    navigate("/program");
  };

  const increment = () => {
    if (currentProgram.length === 0) return;
    setIndex((prevIndex) => (prevIndex + 1) % currentProgram.list.length); // Loop back to start
  };

  const deincrement = () => {
    if (!currentProgram.list.length) return; // Prevent errors if list is empty

    setIndex((prevIndex) => (prevIndex === 0 ? currentProgram.list.length - 1 : prevIndex - 1));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#ffffff",
        overflow: "auto",
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem 1rem",
        }}
      >
        {/* Header with Back Button */}
        <Box sx={{ width: "100%", maxWidth: "1200px", mb: "2rem" }}>
          <Button
            onClick={handleNavigate}
            sx={{
              px: "1.5rem",
              py: "0.75rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: "rgba(26, 26, 46, 0.6)",
              backdropFilter: "blur(10px)",
              color: "#d4af37",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "8px",
              textTransform: "none",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              "&:hover": {
                background: "rgba(26, 26, 46, 0.9)",
                borderColor: "#d4af37",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(212, 175, 55, 0.2)",
              },
            }}
          >
            <List size={18} />
            All Programs
          </Button>
        </Box>

        {/* Program Name Header */}
        <Box sx={{ maxWidth: "800px", mb: "2rem" }}>
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
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#d4af37",
                letterSpacing: "0.5px",
              }}
            >
              Exercise {index + 1} of {currentProgram.list.length}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              fontWeight: 800,
              mb: "0.5rem",
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            {currentProgram.name}
          </Typography>
        </Box>

        {/* Exercise Content */}
        {loading ? (
          <Card
            sx={{
              background: "rgba(26, 26, 46, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "16px",
              padding: "4rem 2rem",
              mb: "2rem",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Loader
                size={48}
                style={{
                  color: "#d4af37",
                  animation: "spin 1s linear infinite",
                }}
              />
              <Typography
                sx={{
                  mt: 2,
                  fontSize: "1.125rem",
                  color: "#b0b0b0",
                }}
              >
                Loading exercise...
              </Typography>
            </Box>
          </Card>
        ) : error ? (
          <Card
            sx={{
              background: "rgba(26, 26, 46, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 107, 107, 0.3)",
              borderRadius: "16px",
              padding: "4rem 2rem",
              mb: "2rem",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.125rem",
                color: "#ff6b6b",
              }}
            >
              Error loading exercise!
            </Typography>
          </Card>
        ) : (
          <Box sx={{ mb: "2rem", width: "100%" }}>
            <ExercisePage exerciseName={currentProgram.list[index]} exerciseData={exerciseData} />
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
            maxWidth: "800px",
          }}
        >
          {/* Previous Button + Message */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              onClick={deincrement}
              disabled={index === 0}
              sx={{
                px: "2rem",
                py: "0.875rem",
                fontSize: "1rem",
                fontWeight: 700,
                background: index === 0 
                  ? "rgba(26, 26, 46, 0.4)" 
                  : "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                color: index === 0 ? "#666" : "#0a0e27",
                border: "none",
                borderRadius: "8px",
                textTransform: "none",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: index === 0 ? "not-allowed" : "pointer",
                "&:hover": index === 0 ? {} : {
                  background: "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(212, 175, 55, 0.3)",
                },
              }}
            >
              <ChevronLeft size={20} />
              Previous
            </Button>
            {index === 0 && (
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  color: "#b0b0b0",
                  fontStyle: "italic",
                }}
              >
                Start of Program
              </Typography>
            )}
          </Box>

          {/* Next Button + Message */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {index === currentProgram.list.length - 1 && (
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  color: "#b0b0b0",
                  fontStyle: "italic",
                }}
              >
                End of Program
              </Typography>
            )}
            <Button
              onClick={increment}
              disabled={index === currentProgram.list.length - 1}
              sx={{
                px: "2rem",
                py: "0.875rem",
                fontSize: "1rem",
                fontWeight: 700,
                background: index === currentProgram.list.length - 1 
                  ? "rgba(26, 26, 46, 0.4)" 
                  : "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                color: index === currentProgram.list.length - 1 ? "#666" : "#0a0e27",
                border: "none",
                borderRadius: "8px",
                textTransform: "none",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: index === currentProgram.list.length - 1 ? "not-allowed" : "pointer",
                "&:hover": index === currentProgram.list.length - 1 ? {} : {
                  background: "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(212, 175, 55, 0.3)",
                },
              }}
            >
              Next
              <ChevronRight size={20} />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Add keyframes for loader animation */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </Box>
  );
}

export default ProgramOverlay;
