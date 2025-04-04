import React, { useState } from 'react';
import { Box, TextField, IconButton, Paper, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface TextingInputBoxProps {
  onSendMessage: (message: string) => void;
}

export default function TextingInputBox({ onSendMessage }: TextingInputBoxProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        ml: '-5%',
        backgroundColor: '#f0f0f0',
        padding: '5%',
        mt: 'auto'
      }}
    >
      <Stack direction="row" spacing={1}>
        <TextField
          multiline
          rows={2.5}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{
            flex: 1,
            border: '1.5px solid #0066b2',
            backgroundColor: 'white',
            
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },

          }}
        />
        <IconButton color="primary" onClick={handleSendMessage} sx={{ alignSelf: 'flex-end' }}>
          <SendIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
}
