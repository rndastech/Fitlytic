import React, { useState, useEffect } from "react";
import {
  IconButton,
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  MenuItem,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { loadExerciseSettings, storeExerciseSettings } from "../utils/helpers/ExerciseSettings";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setVoiceName, getVoiceName, setVoice } from "../utils/helpers/Audio";

/**
 * A React functional component for displaying and managing a modal that allows users to adjust
 * exercise-specific settings, such as target angles. The settings are dynamically rendered
 * based on the provided configuration and stored for authenticated users.
 *
 * @component
 *
 * @param {string} exerciseName - The name of the exercise for which the settings apply.
 * @param {Object} targetAngles - An object containing the current target angle values for the exercise.
 * @param {Array} setTargetAnglesArray - An array of [setStateFunction, key] pairs for dynamically updating the target angles.
 *
 * @returns {JSX.Element} The rendered SettingsModal component.
 */
function SettingsModal({
  exerciseName,
  targetAngles,
  setTargetAnglesArray,
  angleView,
  setAngleView,
  drawSkeleton,
  setDrawSkeleton,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [userEmail, setUsername] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [voicesList, setVoicesList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(getVoiceName());

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    if (userLoggedIn) {
      storeExerciseSettings(userEmail, exerciseName, targetAngles);
      loadExerciseSettings(userEmail, exerciseName, setTargetAnglesArray);
    }
  };

  const handleInputChange = (index, value) => {
    const [setAngle, key] = setTargetAnglesArray[index];
    setAngle(value); // Update the state directly
  };

  const handleToggleAngleView = () => {
    setAngleView(!angleView);
  };

  const handleToggleDrawSkeleton = () => {
    setDrawSkeleton(!drawSkeleton);
  };

  const handleVoiceChange = (event) => {
    const newVoice = event.target.value;
    setSelectedVoice(newVoice);
    setVoiceName(newVoice);
    setVoice();
  };

  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoicesList(["None", ...availableVoices.map((voice) => voice.name)]);
    };

    fetchVoices();
    window.speechSynthesis.onvoiceschanged = fetchVoices;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.email);
        setUserLoggedIn(true);
        // Load settings upon a signed-in user navigating to exercise page;
        // if the user does not have saved settings, this will do nothing,
        // and the last set values will be used (most likely default values)
        loadExerciseSettings(userEmail, exerciseName, setTargetAnglesArray);
      } else {
        setUsername("");
        setUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [userEmail]);

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
        <SettingsIcon fontSize="small" />
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>Settings</Typography>
      </IconButton>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxWidth: "90%",
            background: "rgba(26, 26, 46, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "16px",
            boxShadow: "0px 0px 40px 0px rgba(212, 175, 55, 0.3)",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#ffffff",
          }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              mb: "1.5rem",
              color: "#d4af37",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}>
            Adjust Exercise Settings
          </Typography>
          {setTargetAnglesArray.map(([_, key], index) => (
            <TextField
              key={key}
              label={`Target ${key.replace("target", "")}`}
              type="number"
              value={targetAngles[key]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              sx={{ 
                marginBottom: "1rem",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "rgba(212, 175, 55, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#d4af37",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#d4af37",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#b0b0b0",
                  "&.Mui-focused": {
                    color: "#d4af37",
                  },
                },
              }}
            />
          ))}
          <Button 
            variant="contained" 
            onClick={handleToggleAngleView} 
            sx={{ 
              mb: "1rem",
              width: "100%",
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#d4af37",
              fontWeight: 700,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                background: "rgba(212, 175, 55, 0.2)",
                transform: "translateY(-2px)",
              },
            }}>
            {angleView ? "Turn off angle display" : "Turn on angle display"}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleToggleDrawSkeleton} 
            sx={{ 
              mb: "1rem",
              width: "100%",
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#d4af37",
              fontWeight: 700,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                background: "rgba(212, 175, 55, 0.2)",
                transform: "translateY(-2px)",
              },
            }}>
            {drawSkeleton ? "Turn off draw skeleton" : "Turn on draw skeleton"}
          </Button>
          <FormControl sx={{ mb: "1rem", width: "100%" }}>
            <TextField
              select
              label="Select Voice"
              value={selectedVoice}
              onChange={handleVoiceChange}
              helperText="⚠ WARNING: Not all voices have been tested."
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "rgba(212, 175, 55, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#d4af37",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#d4af37",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#b0b0b0",
                  "&.Mui-focused": {
                    color: "#d4af37",
                  },
                },
                "& .MuiFormHelperText-root": {
                  color: "#b0b0b0",
                },
                "& .MuiSvgIcon-root": {
                  color: "#d4af37",
                },
              }}
              slotProps={{
                select: {
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        background: "rgba(26, 26, 46, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        color: "#ffffff",
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            background: "rgba(212, 175, 55, 0.1)",
                          },
                          "&.Mui-selected": {
                            background: "rgba(212, 175, 55, 0.2)",
                            "&:hover": {
                              background: "rgba(212, 175, 55, 0.3)",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              }}>
              {voicesList.map((voice, index) => (
                <MenuItem key={index} value={voice}>
                  {voice}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <Button 
            variant="contained" 
            onClick={handleCloseModal}
            sx={{
              width: "100%",
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
            Save & Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default SettingsModal;
