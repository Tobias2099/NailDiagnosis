import React from 'react';
import { Box, Typography } from '@mui/material';

interface MessageProps {
  text: string;
  isUser: boolean;  // true if the message is from the user, false if it's from the bot
}

export default function Message({ text, isUser }: MessageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        margin: '10px 0',
      }}
    >
      <Box
        sx={{
          maxWidth: '75%',
          padding: '10px 15px',
          borderRadius: '12px',
          backgroundColor: isUser ? '#0066b2' : '#f0f0f0',
          color: isUser ? 'white' : 'black',
          boxShadow: '0 0 4px rgba(0,0,0,0.1)'
        }}
      >
        <Typography sx={{ fontSize: '0.9rem' }}>{text}</Typography>
      </Box>
    </Box>
  );
}
