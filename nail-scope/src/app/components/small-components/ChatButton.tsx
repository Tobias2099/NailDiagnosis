'use client';

import { Button } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useChat } from '../../context/ChatContext';

export default function ChatButton() {
  const { isChat, toggleChat } = useChat();

  return (
    <Button 
      variant="outlined" 
      startIcon={<SmartToyIcon />} 
      onClick={toggleChat}
      sx={{ 
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: isChat ? '#0066b2' : 'white',
        borderColor: '#0066b2',
        color: isChat ? 'white' : '#0066b2',
        '&:hover': {
          backgroundColor: isChat ? 'white' : '#0066b2',
          color: isChat ? '#0066b2' : 'white',
        },
        boxShadow: '0px 0px 8px rgba(0,0,0,0.2)'
      }}
    >
      {isChat ? 'Close Chat' : 'Chat'}
    </Button>
  );
}
