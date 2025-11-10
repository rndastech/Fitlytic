import { React, useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import ExerciseHistoryTable from "../components/ExerciseHistoryTable";
import { TrendingUp } from "lucide-react";

const MyExerSights = () => {
  const auth = getAuth();

  const [isAuth, setIsAuth] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState([]);

  const fetchExerciseHistory = async (userEmail) => {
    try {
      const userDocRef = doc(db, "users", userEmail);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Get the exerciseHistory field
        const history = userDoc.data().exerciseHistory || {};

        // Convert to array and sort by timestamp (keys) in descending order
        const sortedHistory = Object.entries(history)
          .map(([timestamp, data]) => ({
            timestamp: parseInt(timestamp),
            ...data,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        // Log the sorted history
        setExerciseHistory(sortedHistory);
      } else {
        console.log("No such user document!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching exercise history:", error);
      return [];
    }
  };

  // call this method whenever authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true); // signed in
        fetchExerciseHistory(auth.currentUser.email);
      } else {
        setIsAuth(false); // signed out
      }
    });

    return () => unsubscribe();
  }, [auth]);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: "2rem 1rem", md: "4rem 2rem" },
        }}
      >
        {/* Header Section */}
        <Box sx={{ maxWidth: "1200px", width: "100%", mb: "3rem", textAlign: "center" }}>
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
            <TrendingUp size={16} style={{ color: "#d4af37" }} />
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#d4af37",
                letterSpacing: "0.5px",
              }}
            >
              Your Progress Dashboard
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              mb: "1rem",
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            Your ExerSights History
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              color: "#b0b0b0",
              mb: "2rem",
              lineHeight: 1.6,
            }}
          >
            Track your fitness journey and monitor your progress over time
          </Typography>
        </Box>

        {/* Table Container with themed styling */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            background: "rgba(26, 26, 46, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            borderRadius: "16px",
            padding: { xs: "1rem", md: "2rem" },
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(26, 26, 46, 0.8)",
              borderColor: "rgba(212, 175, 55, 0.4)",
              boxShadow: "0 20px 40px rgba(212, 175, 55, 0.15)",
            },
          }}
        >
          <ExerciseHistoryTable exerciseHistory={exerciseHistory} setExerciseHistory={setExerciseHistory} />
        </Box>

        {/* Note */}
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "#808080",
            mt: "2rem",
            maxWidth: "700px",
            lineHeight: 1.6,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Note: Mobile users or users with limited screen width may have to scroll horizontally to see
          the entire table.
        </Typography>
      </Box>
    </Box>
  );
};

export default MyExerSights;
