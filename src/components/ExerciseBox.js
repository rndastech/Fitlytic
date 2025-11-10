import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Modal,
} from "@mui/material";
import WebcamCanvas from "./WebcamCanvas";
import VideoCanvas from "./VideoCanvas";
import startPoseDetection from "../utils/models/PoseDetectorPoseVideo";
import detectPose from "../utils/models/PoseDetector";
import OverlayBox from "./CounterGraphic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { unlockAudio } from "../utils/helpers/Audio";

/**
 * ExerciseBox component - A reusable layout component for exercise tracking pages.
 *
 * This component handles camera/video selection, pose detection, and exercise feedback.
 * It manages webcam streams, video uploads, and integrates with pose detection utilities.
 *
 * @component
 * @param {string} title - The title of the exercise page
 * @param {JSX.Element} feedbackPanel - Component for displaying exercise feedback and controls
 * @param {Function} processPoseResults - Function to process pose detection results
 * @param {string} color - Color theme for visual feedback
 * @param {number} repCount - Current repetition count
 * @param {boolean} drawSkeleton - Whether to draw skeleton overlay on video
 * @param {boolean} playFeedback - Whether feedback is currently active
 * @param {Function} setPlayFeedback - Function to toggle feedback state
 * @param {boolean} showSummary - Whether to show exercise summary
 * @param {Function} setShowSummary - Function to toggle summary display
 * @returns {JSX.Element} The exercise interface with video feed and controls
 */
function ExerciseBox({
  title,
  feedbackPanel,
  processPoseResults,
  color,
  repCount,
  drawSkeleton,
  playFeedback,
  setPlayFeedback,
  showSummary,
  setShowSummary,
  handleReset,
  auth,
  isAuth,
}) {
  const [useVideo, setUseVideo] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(
    localStorage.getItem("selectedCamera") || ""
  );
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [stream, setStream] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(Date.now());

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);

  const handleCameraChange = (event) => {
    const newCamera = event.target.value;
    setLoading(true);
    setSelectedCamera(newCamera);
    localStorage.setItem("selectedCamera", newCamera);
    setForceRemountKey((prev) => prev + 1);
  };

  const handleUserMediaLoaded = (newStream) => {
    setStream(newStream);
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      const videoElement = videoRef.current;

      videoElement.src = videoURL;
      videoElement.onloadeddata = () => {
        videoElement.pause(); // Pause initially until the user plays it
      };

      setUseVideo(true);
    }
  };

  const handleUploadPlay = () => {
    const videoElement = videoRef.current;
    startPoseDetection(videoElement, videoCanvasRef, processPoseResults);
  };

  const handlePlayFeedback = () => {
    if (!playFeedback) unlockAudio();

    setPlayFeedback(!playFeedback);
    if (!playFeedback) setStartTime(Date.now());
    else setEndTime(Date.now());
  };

  const saveExerciseSummary = async (userEmail, exerciseSummary) => {
    try {
      const userRef = doc(db, "users", userEmail);
      await setDoc(userRef, { exerciseHistory: exerciseSummary }, { merge: true });
    } catch (e) {
      console.log("Error saving programs to Firestore:", e);
    }
  };

  const handleSummaryCloseWithSave = () => {
    setShowSummary(!showSummary);
    handleReset();

    // if user is logged in, ask if they want to save the exercise summary
    if (isAuth) {
      // add functionality to OPTIONALLY save reuslt to firebase
      let exerciseSummary = {};
      exerciseSummary[Date.now().toString()] = {
        exercise: title,
        repCount: repCount,
        duration: (endTime - startTime) / 1000,
      };
      saveExerciseSummary(auth.currentUser.email, exerciseSummary);
    }
  };

  const enhancedFeedbackPanel = React.cloneElement(feedbackPanel, {
    handleVideoUpload: handleVideoUpload,
  });

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults, drawSkeleton);
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setAvailableCameras(cameras);
      if (cameras.length > 0) {
        const storedCamera = localStorage.getItem("selectedCamera");
        const validCamera = cameras.some((cam) => cam.deviceId === storedCamera)
          ? storedCamera
          : cameras[0].deviceId;
        setSelectedCamera(validCamera);
        localStorage.setItem("selectedCamera", validCamera);
      }
    });
  }, [drawSkeleton]);

  useEffect(() => {
    if (repCount > 0) {
      setShowOverlay(false);
      setTimeout(() => setShowOverlay(true), 10);
      setTimeout(() => setShowOverlay(false), 1000);
    }
  }, [repCount]);

  useEffect(() => {
    setLoading(!stream);
  }, [stream]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        setAvailableCameras(cameras);

        if (cameras.length > 0) {
          const storedCamera = localStorage.getItem("selectedCamera");
          const validCamera = cameras.some((cam) => cam.deviceId === storedCamera)
            ? storedCamera
            : cameras[0].deviceId;

          setSelectedCamera(validCamera);
          localStorage.setItem("selectedCamera", validCamera);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras(); // Fetch on mount

    const interval = setInterval(fetchCameras, 2000); // Refresh every 2s
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box sx={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)",
      color: "#ffffff",
      padding: "2rem 0.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
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
          zIndex: 0,
        }}
      />

      <Modal open={showSummary} onClose={handleSummaryCloseWithSave}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "35rem",
            maxWidth: "90%",
            background: "rgba(26, 26, 46, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "16px",
            boxShadow: "0px 0px 40px 0px rgba(212, 175, 55, 0.3)",
            p: "2rem",
            textAlign: "center",
            color: "#ffffff",
          }}>
          <Typography variant="h3" sx={{ 
            mb: "1.5rem",
            background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
          }}>
            Exercise Summary
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "left", mb: "0.75rem", color: "#b0b0b0" }}>
            <Box component="span" sx={{ color: "#d4af37", fontWeight: 600 }}>Exercise:</Box> {title}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "left", mb: "0.75rem", color: "#b0b0b0" }}>
            <Box component="span" sx={{ color: "#d4af37", fontWeight: 600 }}>Repetitions:</Box> {repCount}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "left", mb: "1.5rem", color: "#b0b0b0" }}>
            <Box component="span" sx={{ color: "#d4af37", fontWeight: 600 }}>Duration:</Box> {(endTime - startTime) / 1000} seconds
          </Typography>
          <Typography variant="h5" sx={{ 
            mb: "1.5rem",
            color: "#d4af37",
            fontWeight: 700,
          }}>
            {repCount ? "Great work!" : "Hmm... try again..."}
          </Typography>
          {isAuth ? (
            <Box>
              <Typography variant="body1" sx={{ mb: "0.75rem", color: "#ffffff" }}>
                Would you like to save this summary to your exercise history?
              </Typography>
              <Typography variant="body2" sx={{ mb: "1.5rem", color: "#b0b0b0" }}>
                You can view your saved summaries in the "My Fitlytic" tab!
              </Typography>
              <Box sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleSummaryCloseWithSave}
                  sx={{ 
                    width: "45%",
                    background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                    color: "#0a0e27",
                    fontWeight: 700,
                    "&:hover": {
                      background: "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                      transform: "translateY(-2px)",
                    },
                  }}>
                  YES
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowSummary(!showSummary);
                    handleReset();
                  }}
                  sx={{ 
                    width: "45%",
                    background: "rgba(212, 175, 55, 0.1)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    color: "#d4af37",
                    fontWeight: 700,
                    "&:hover": {
                      background: "rgba(212, 175, 55, 0.2)",
                      transform: "translateY(-2px)",
                    },
                  }}>
                  NO
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  setShowSummary(!showSummary);
                  handleReset();
                }}
                sx={{ 
                  width: "60%",
                  background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                  color: "#0a0e27",
                  fontWeight: 700,
                  "&:hover": {
                    background: "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                    transform: "translateY(-2px)",
                  },
                }}>
                TAKE ME BACK
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: "2rem",
            gap: 2,
          }}>
          <Typography 
            variant="h1" 
            sx={{ 
              textAlign: "center",
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
            height: "fit-content",
            gap: "2rem",
          }}>
          <Box
            sx={{
              border: `3px solid ${color || "#d4af37"}`,
              borderRadius: "16px",
              overflow: "hidden",
              my: "1.25rem",
              display: useVideo ? "none" : "",
              position: "relative",
              boxShadow: `0px 0px 40px 0px ${color || "rgba(212, 175, 55, 0.3)"}`,
              width: "100%",
              maxWidth: "900px",
              background: "rgba(26, 26, 46, 0.3)",
              backdropFilter: "blur(10px)",
              "@media (orientation: landscape)": {
                width: "auto",
                height: "fit-content",
                maxWidth: "100vh",
              },
            }}>
            <WebcamCanvas
              dimensions={{ width: window.innerWidth, height: window.innerHeight }}
              ref={{ webcamRef, canvasRef }}
              videoDeviceId={selectedCamera}
              key={forceRemountKey}
              onUserMediaLoaded={handleUserMediaLoaded}
            />
            {showOverlay && <OverlayBox text={repCount} />}
          </Box>

          <Box
            sx={{
              border: `3px solid ${color || "#d4af37"}`,
              borderRadius: "16px",
              overflow: "hidden",
              padding: "5px",
              display: useVideo ? "" : "none",
              boxShadow: `0px 0px 40px 0px ${color || "rgba(212, 175, 55, 0.3)"}`,
              width: "100%",
              maxWidth: "900px",
              background: "rgba(26, 26, 46, 0.3)",
              backdropFilter: "blur(10px)",
              "@media (orientation: landscape)": {
                width: "auto",
                height: "fit-content",
                maxWidth: "100vh",
              },
            }}>
            <VideoCanvas
              handleUploadPlay={handleUploadPlay}
              ref={{ videoRef, canvasRef: videoCanvasRef }}
            />
            {showOverlay && <OverlayBox text={repCount} />}
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
                mt: "1rem",
                gap: "1rem",
                mb: "1rem",
                width: "28rem",
                maxWidth: "95vw",
              }}>
              <Button 
                variant="contained" 
                onClick={handlePlayFeedback}
                sx={{
                  px: "2rem",
                  py: "0.75rem",
                  background: playFeedback 
                    ? "rgba(212, 175, 55, 0.1)" 
                    : "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                  color: playFeedback ? "#d4af37" : "#0a0e27",
                  border: playFeedback ? "1px solid rgba(212, 175, 55, 0.3)" : "none",
                  fontWeight: 700,
                  borderRadius: "8px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: playFeedback
                      ? "rgba(212, 175, 55, 0.2)"
                      : "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3)",
                  },
                }}>
                {playFeedback ? (
                  <>
                    <StopIcon />
                    <Typography sx={{ mx: "5px" }}>Stop Feedback</Typography>
                  </>
                ) : (

                  <>
                    <PlayArrowIcon />
                    <Typography sx={{ mx: "5px" }}>Start Feedback</Typography>
                  </>
                )}
              </Button>
              <FormControl 
                sx={{ 
                  flex: 1,
                  minWidth: "200px",
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    background: "rgba(26, 26, 46, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "rgba(212, 175, 55, 0.2)",
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
                  "& .MuiSvgIcon-root": {
                    color: "#d4af37",
                  },
                }}>
                <InputLabel>Choose Camera</InputLabel>
                <Select 
                  value={selectedCamera} 
                  onChange={handleCameraChange} 
                  label="Choose Camera"
                  MenuProps={{
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
                  }}>
                  {availableCameras.map((camera) => (
                    <MenuItem key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {enhancedFeedbackPanel}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ExerciseBox;
