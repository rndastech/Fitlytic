import React, { useEffect, useState } from "react";
import { Typography, Box, IconButton, Button, Card } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Assuming Grid2 was intentional
import { useNavigate } from "react-router-dom";
import ProgramModal from "../components/ProgramModal"; // Assuming path is correct
import { Trash2, Plus, Play, List } from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Assuming path is correct
import toast from "react-hot-toast";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig"; // Assuming path is correct
// Consider using UUIDs for more robust IDs if needed
// import { v4 as uuidv4 } from 'uuid';

// Default programs data (used as initial state and fallback)
const defaultPrograms = {
  1: { name: "Core", list: ["plank", "deadBug", "bridge"] },
  2: { name: "Back", list: ["pullUp", "muscleUp"] },
};

// Modified save function to throw errors for better handling
const saveProgramsToDatabase = async (userEmail, programsToSave) => {
  try {
    const userRef = doc(db, "users", userEmail, "programs", "userPrograms");
    await setDoc(userRef, programsToSave, { merge: true });
  } catch (error) {
    console.error("Error saving programs to Firestore:", error);
    // Re-throw the error so the calling function (addProgram/removeProgram) can handle it
    throw new Error("Failed to save programs to database.");
  }
};

function Program() {
  const navigate = useNavigate();
  // Initialize state with defaults, matching original behaviour
  const [programsState, setProgramsState] = useState(defaultPrograms);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        // Check for user and email
        try {
          const docRef = doc(
            db,
            "users",
            user.email,
            "programs",
            "userPrograms"
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // Ensure fetched data isn't null/undefined before setting state
            setProgramsState(docSnap.data() || {});
          } else {
            // User logged in, but no program data found.
            // Keep state empty or set defaults? Original code implied setting defaults.
            setProgramsState({}); // Start fresh for logged-in user with no saved data
            // Or: setProgramsState(defaultPrograms); // If you want them to start with defaults
          }
        } catch (e) {
          console.error("Error reading user programs:", e);
          toast.error("Could not load your saved programs.");
          // Fallback to defaults if read fails for logged-in user
          setProgramsState(defaultPrograms);
        }
      } else {
        // User is logged out, show defaults
        setProgramsState(defaultPrograms);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array is correct

  const handleNavigate = (programId) => {
    // Ensure program and list exist before accessing length or navigating
    if (
      !programsState[programId] ||
      !Array.isArray(programsState[programId].list)
    ) {
      console.error(`Program data or list missing for ID: ${programId}`);
      toast.error("Cannot start program: data missing or invalid.");
      return;
    }
    if (programsState[programId].list.length === 0) {
      toast.error("Empty Program"); // Original message
      logEvent(analytics, "notification_received", {
        notification_type: "empty_program_start_attempt",
      });
      return;
    }
    navigate("/programOverlay", {
      state: { currentProgram: programsState[programId] },
    });
  };

  const addProgram = async () => {
    // Make async
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      // Check user and email
      toast.error("You must be logged in to add a program.");
      logEvent(analytics, "notification_received", {
        notification_type: "add_program_auth_fail",
      });
      return;
    }

    // **Improved ID Generation (Example: Max numeric ID + 1)**
    const existingIds = Object.keys(programsState)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newProgramId = (maxId + 1).toString();

    // **Alternative ID: Timestamp**
    // const newProgramId = Date.now().toString();

    const newProgramData = {
      name: `New Program ${newProgramId}`,
      list: [],
    };

    // **Fix: Calculate the definitive new state *before* calling setState**
    const newState = {
      ...programsState,
      [newProgramId]: newProgramData,
    };

    // **Store current state for potential rollback**
    const previousState = programsState;

    // **Optimistic UI Update**
    setProgramsState(newState);

    // **Save the calculated new state to DB and handle errors**
    try {
      await saveProgramsToDatabase(user.email, newState);
      toast.success("Program added!"); // Provide success feedback
      logEvent(analytics, "program_added", { program_id: newProgramId });
    } catch (error) {
      console.error("Failed to save new program:", error);
      toast.error(
        `Error adding program: ${error.message || "Please try again."}`
      ); // Provide error feedback
      logEvent(analytics, "program_add_failed", { error: error.message });
      // **Rollback UI on failure**
      setProgramsState(previousState); // Revert to the state before attempting the add
    }
  };

  const removeProgram = async (programId) => {
    // Make async
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      // Check user and email
      toast.error("You must be logged in to remove a program.");
      logEvent(analytics, "notification_received", {
        notification_type: "remove_program_auth_fail",
      });
      return;
    }

    // Get name for confirmation dialog, handle if program doesn't exist unexpectedly
    const programNameToDelete =
      programsState[programId]?.name || `Program ${programId}`;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${programNameToDelete}"?`
    );
    if (!confirmDelete) return;

    // **Store the current state in case we need to rollback**
    const previousState = { ...programsState };

    // **Optimistic UI update**
    setProgramsState((prevPrograms) => {
      const updatedPrograms = { ...prevPrograms };
      delete updatedPrograms[programId];
      return updatedPrograms;
    });

    // **Try to update Firestore**
    try {
      const programRef = doc(
        db,
        "users",
        user.email,
        "programs",
        "userPrograms"
      );
      // Use updateDoc with deleteField to remove the specific program key
      await updateDoc(programRef, {
        [programId]: deleteField(),
      });
      toast.success(`"${programNameToDelete}" deleted.`); // Success feedback
      logEvent(analytics, "program_removed", { program_id: programId });
    } catch (error) {
      console.error("Failed to delete program from Firestore:", error);
      toast.error(
        `Error deleting program: ${error.message || "Please try again."}`
      ); // Error feedback
      logEvent(analytics, "program_remove_failed", {
        program_id: programId,
        error: error.message,
      });
      // **Rollback UI on failure**
      setProgramsState(previousState);
    }
  };

  // --- JSX Rendering ---
  // (Keeping the original structure and styling props)
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem 1rem",
        }}
      >
        {/* Header Section */}
        <Box sx={{ maxWidth: "800px", mb: "3rem" }}>
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
            <List size={16} style={{ color: "#d4af37" }} />
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#d4af37",
                letterSpacing: "0.5px",
              }}
            >
              Workout Programs
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
            Your Programs
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "#b0b0b0",
              lineHeight: 1.6,
            }}
          >
            Start with a pre-made program, or create your own personalized workout routine!
          </Typography>
        </Box>

      <Grid container spacing={3} justifyContent="center"
        sx={{ 
          width: "100%", 
          maxWidth: "1200px",
          mb: "2rem" 
        }}
      >
        {/* Check if programsState is a valid object before mapping */}       {" "}
        {programsState &&
          typeof programsState === "object" &&
          Object.entries(programsState).map(([programId, programData]) => {
            // Basic check for valid programData structure to prevent render errors
            if (
              !programData ||
              typeof programData.name !== "string" ||
              !Array.isArray(programData.list)
            ) {
              console.warn(
                `Invalid program data structure for ID: ${programId}`,
                programData
              );
              return null; // Skip rendering this item if data is malformed
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={programId}>
                  <Card
                    sx={{
                      background: "rgba(26, 26, 46, 0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "16px",
                      padding: "2rem",
                      textAlign: "center",
                      minHeight: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(26, 26, 46, 0.9)",
                        borderColor: "#d4af37",
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(212, 175, 55, 0.15)",
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          mb: "0.5rem",
                        }}
                      >
                        {programData.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: "#b0b0b0",
                          mb: "1.5rem",
                        }}
                      >
                        {programData.list.length} exercise{programData.list.length !== 1 ? 's' : ''}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <ProgramModal
                          programId={programId}
                          programData={programData}
                          programsState={programsState}
                          setProgramsState={setProgramsState}
                        />
                        <IconButton
                          onClick={() => removeProgram(programId)}
                          sx={{
                            color: "#ff6b6b",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 107, 107, 0.1)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Trash2 size={20} />
                        </IconButton>
                      </Box>
                    </Box>

                    <Button
                      onClick={() => handleNavigate(programId)}
                      sx={{
                        px: "1.5rem",
                        py: "0.75rem",
                        fontSize: "1rem",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                        color: "#0a0e27",
                        border: "none",
                        borderRadius: "8px",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        width: "100%",
                        "&:hover": {
                          background: "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 25px rgba(212, 175, 55, 0.3)",
                        },
                      }}
                    >
                      <Play size={18} />
                      Start Program
                    </Button>
                  </Card>
              </Grid>
            );
          })}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={addProgram}
            sx={{
              background: "rgba(26, 26, 46, 0.4)",
              backdropFilter: "blur(10px)",
              border: "2px dashed rgba(212, 175, 55, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(26, 26, 46, 0.7)",
                borderColor: "#d4af37",
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(212, 175, 55, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                padding: "1rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: "1rem",
              }}
            >
              <Plus size={32} style={{ color: "#0a0e27" }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "#d4af37",
              }}
            >
              Create New Program
            </Typography>
          </Card>
        </Grid>
        {" "}
      </Grid>
      {" "}
      </Box>
    </Box>
  );
}

export default Program;
