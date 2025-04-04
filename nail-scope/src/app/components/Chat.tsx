import React from 'react';
import { Paper, Box } from '@mui/material';
import TextingInputBox from './small-components/TextingInputBox';
import Message from './small-components/Message';
import { useChat, MessageType } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { messageHistory, setMessageHistory } = useChat();
  const { profile } = useAuth();

  const sendMessage = async (message: string) => {
  
    const systemPrompt: MessageType = {
      role: 'system',
      content: `User profile:
      - Name: ${profile?.username || "N/A"}
      - Sex: ${profile?.sex || "N/A"}
      - Height: ${profile?.height || "N/A"} cm
      - Weight: ${profile?.weight || "N/A"} kg
      - Medical History: ${profile?.medicalHistory || "None"}`
    };
  
    // Only include the system prompt if it's not already in the history
    const hasSystem = messageHistory?.length && messageHistory[0].role === 'system';
    const baseHistory = hasSystem ? messageHistory : [systemPrompt];

    const updated: MessageType[] = [
      ...(baseHistory || []),
      {role: 'user', content: message}
    ]
    setMessageHistory(updated);

    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ messageHistory: updated })
    });

    const data = await res.json();

    setMessageHistory([
      ...updated,
      { role: 'assistant', content: data.response }
    ]);
    
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageHistory]);


  return (
    <>
      <Paper sx={{ 
        border: '1px solid grey', 
        mt: '1%', 
        height: '80%', 
        width: '20%', 
        padding: '1%', 
        paddingBottom: '0%', 
        ml: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
      }}>
        <Box ref={scrollRef} sx={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '5px',
          paddingBottom: '5px',
        }}>
          {
            messageHistory && 
            messageHistory.map((item, index) => {
              if (item.role !== 'system') {
                return (
                  <Message key={index} isUser={item.role === 'user'} text={item.content} />
                );
              }
              return null;
            })
          }
        </Box>

        {/* Text Input Box */}
        <TextingInputBox onSendMessage={sendMessage}/>
      </Paper>
    </>
  );
};
