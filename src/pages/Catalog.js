import React, { useState, useEffect } from "react";
import { Typography, Box, TextField, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExerciseCard from "../components/ExerciseCard.js";
import { catalogText } from "../assets/content.js";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import toast from "react-hot-toast";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";
import { Search, Dumbbell } from "lucide-react";

const getImageForExercise = (key) => {
  try {
    return require(`../assets/exercise-cards/${key}.jpg`);
  } catch {
    try {
      return require(`../assets/exercise-cards/${key}.png`);
    } catch {
      console.warn(`No image found for ${key}`);
      return null;
    }
  }
};

const exerciseImages = Object.fromEntries(
  Object.keys(catalogText).map((key) => [key, getImageForExercise(key)])
);

/**
 * Catalog is a React functional component that displays a list of exercise cards.
 * It dynamically iterates through the catalogText object to generate the exercise cards.
 * Includes a search bar to filter exercises by name or key.
 *
 * @returns {JSX.Element} A catalog page displaying exercises.
 */
function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedExercises, setPinnedExercises] = useState([]);

  const filteredExercises = Object.keys(catalogText)
    .filter((exerciseKey) =>
      exerciseKey.toLowerCase().includes(searchTerm.toLowerCase().replace(/\s/g, ""))
    )
    .sort((a, b) => {
      const aPinned = pinnedExercises.includes(a);
      const bPinned = pinnedExercises.includes(b);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });

  const togglePin = async (exerciseKey) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to pin an exercise.");
      logEvent(analytics, "notification_received");
      return;
    }

    const docRef = doc(db, "users", user.email, "pinnedExercises", "pinnedExercises");

    try {
      const docSnap = await getDoc(docRef);
      let updatedPins = [];

      if (!docSnap.exists()) {
        updatedPins = [exerciseKey];
        await setDoc(docRef, { pinnedExercises: updatedPins });
      } else {
        const currentPins = docSnap.get("pinnedExercises") || [];
        const isAlreadyPinned = currentPins.includes(exerciseKey);

        updatedPins = isAlreadyPinned
          ? currentPins.filter((key) => key !== exerciseKey)
          : [...currentPins, exerciseKey];

        await updateDoc(docRef, {
          pinnedExercises: updatedPins,
        });
      }

      setPinnedExercises(updatedPins);
    } catch (e) {
      console.error("Failed to toggle pin:", e);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(
            doc(db, "users", user.email, "pinnedExercises", "pinnedExercises")
          );
          if (docSnap.exists()) {
            setPinnedExercises(docSnap.get("pinnedExercises"));
          }
        } catch (e) {
          console.error("Error reading document:", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
          padding: { xs: "2rem 1rem", md: "3rem 2rem" },
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: "3rem" }}>
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
              mb: "1.5rem",
            }}
          >
            <Dumbbell size={16} style={{ color: "#d4af37" }} />
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#d4af37",
                letterSpacing: "0.5px",
              }}
            >
              Exercise Library
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: "1rem",
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            Exercise Catalog
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "#b0b0b0",
              mb: "2rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Browse our comprehensive collection of AI-guided exercises
          </Typography>

          {/* Search Bar */}
          <TextField
            placeholder="Search exercises..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: "500px",
              margin: "0 auto",
              "& .MuiOutlinedInput-root": {
                background: "rgba(26, 26, 46, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "12px",
                color: "#ffffff",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(212, 175, 55, 0.4)",
                  background: "rgba(26, 26, 46, 0.8)",
                },
                "&.Mui-focused": {
                  borderColor: "#d4af37",
                  background: "rgba(26, 26, 46, 0.9)",
                  boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)",
                },
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                color: "#ffffff",
                "&::placeholder": {
                  color: "#808080",
                  opacity: 1,
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} style={{ color: "#d4af37" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Exercise Grid */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            justifyContent: "center", 
            maxWidth: "1400px", 
            margin: "0 auto",
          }}
        >
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exerciseKey) => (
              <ExerciseCard
                key={exerciseKey}
                title={exerciseKey
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                description={catalogText[exerciseKey]}
                link={
                  exerciseKey === "pushUpGame"
                    ? "/pushUpGame"
                    : exerciseKey === "squatGame"
                    ? "/squatGame"
                    : `/exercise?exercise=${exerciseKey}`
                }
                image={exerciseImages[exerciseKey]}
                isPinned={pinnedExercises.includes(exerciseKey)}
                onPinToggle={() => togglePin(exerciseKey)}
              />
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                padding: "4rem 2rem",
                background: "rgba(26, 26, 46, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "16px",
                margin: "2rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  color: "#b0b0b0",
                  fontWeight: 500,
                }}
              >
                No exercises match your search criteria.
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  color: "#808080",
                  mt: "0.5rem",
                }}
              >
                Try adjusting your search terms
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Catalog;