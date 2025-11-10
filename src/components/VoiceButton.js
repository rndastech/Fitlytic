import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import {Box, IconButton, Tooltip, Typography} from '@mui/material';
import React, {useState} from 'react';

import {setVoiceName} from '../utils/helpers/Audio';

function VoiceButton() {
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);

  const toggleVoiceFeedback = () => {
    setVoiceName(voiceFeedbackEnabled ? 'None' : 'Google US English');
    setVoiceFeedbackEnabled((prevState) => !prevState);
  };

  return (
    <Tooltip title={`${voiceFeedbackEnabled ? 'Disable' : 'Enable'} Voice Feedback`}>
      <IconButton onClick={toggleVoiceFeedback}>
        <Box sx={{
    display: 'flex', alignItems: 'center', gap: '3px', color: '#d4af37',
        }}>
          <RecordVoiceOverIcon sx={
    {
      color: voiceFeedbackEnabled ? '#4ade80' : '#d4af37'
    }} />
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>AI Voice</Typography>
        </Box>
      </IconButton>
    </Tooltip>
  );
}

export default VoiceButton;
