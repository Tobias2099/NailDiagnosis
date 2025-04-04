import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from "next/navigation";

export type MessageType = {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  isChat: boolean;
  messageHistory: MessageType[] | undefined;
  setMessageHistory: (messageList: MessageType[] | undefined) => void;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children } : {children: ReactNode}) => {
  const router = useRouter();
  const [isChat, setChat] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageType[] | undefined>(undefined);
  
  const toggleChat = () => {
    setChat(!isChat);
  };

  return (
    <ChatContext.Provider value={{isChat, messageHistory, setMessageHistory, toggleChat}}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within an ChatProvider')
  }
  return context;
}
