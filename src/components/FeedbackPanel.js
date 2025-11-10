import React, { useEffect } from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import Timer from "./Timer";
import VoiceFeedbackButton from "./VoiceButton";

/**
 * A React functional component for rendering a feedback panel that displays real-time
 * feedback, exercise-specific angle values, and repetition count. It also includes options
 * for resetting the count and dynamically inserting modal components for help and settings.
 *
 * @component
 *
 * @param {Array} feedbackList - An array of feedback messages to be displayed.
 * @param {Array} valuesList - An array of objects containing labels and values for angles or other metrics.
 * @param {number} repCount - The current repetition count for the exercise.
 * @param {Function} handleReset - Callback function to reset the repetition count.
 * @param {React.Element} HelpModal - A HelpModal component instance for providing instructions or help.
 * @param {React.Element} SettingsModal - A SettingsModal component instance for adjusting exercise settings.
 *
 * @returns {JSX.Element} The rendered FeedbackPanel component.
 */
function FeedbackPanel({
  feedbackList,
  valuesList,
  repCount,
  handleReset,
  HelpModal,
  SettingsModal,
  handleVideoUpload,
  angleView,
  color,
}) {
  useEffect(() => {
    return () => {
      handleReset();
    };
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        textAlign: "left",
        height: "fit-content",
        width: "28rem",
        maxWidth: "95vw",
        my: "0.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        background: "rgba(26, 26, 46, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        borderRadius: "16px",
        color: "#ffffff",
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: "#d4af37",
            letterSpacing: "0.5px",
          }}>
          Real-Time Feedback Panel
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {HelpModal}
        {SettingsModal}
        <VoiceFeedbackButton />
      </Box>

      <Box sx={{ width: "100%" }}>
        <Typography variant="body1" sx={{ color: "#b0b0b0", mb: "0.5rem" }}>
          Feedback:
          {feedbackList.map((feedback, index) => (
            <Typography 
              key={`feedback-${index}`} 
              variant="body1" 
              sx={{ 
                color: color || "#d4af37",
                fontWeight: 600,
                mt: "0.25rem",
              }}>
              {feedback || index > 0 ? feedback : "Get in frame!"}
            </Typography>
          ))}
        </Typography>
      </Box>

      {valuesList.map((angle, index) =>
        angleView ? (
          <Typography 
            key={`angle-${index}`} 
            variant="body1"
            sx={{ color: "#b0b0b0" }}>
            {`${angle.label}: ${angle.value.toFixed(0)}°`}
          </Typography>
        ) : (
          ""
        )
      )}

      <Typography 
        variant="body1" 
        sx={{ 
          color: "#ffffff",
          fontWeight: 600,
        }}>
        Current Rep Count: <Box component="span" sx={{ color: "#d4af37" }}>{repCount}</Box>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: "1rem", textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleReset}
          sx={{
            width: "48%",
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
          Reset Rep Count
        </Button>

        <Button
          variant="contained"
          component="label"
          sx={{ 
            width: "48%", 
            textAlign: "center",
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
          Upload Video
          <input type="file" accept="video/*" onChange={handleVideoUpload} hidden />
        </Button>
      </Box>

      <Timer />
    </Paper>
  );
}

export default FeedbackPanel;
