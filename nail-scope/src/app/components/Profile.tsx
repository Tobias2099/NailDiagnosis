'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Avatar, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useAuth} from '../context/AuthContext';
import {useChat} from '../context/ChatContext';

export default function ProfileDropdown() {
  const { logout, profile } = useAuth();
  const { isChat, setMessageHistory, toggleChat } = useChat();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleLogout = () => {
    setMessageHistory([]); // Clear first
    if (isChat) toggleChat(); // Then toggle off if open
    logout(); // Proceed to logout
  };
  

  return (
    <>
      <IconButton onClick={handleClick} sx={{ padding: 0, width: 'auto' }}>
        <Stack direction="row" spacing={1}>
          <Avatar sx={{ width: 40, height: 40 }}> 
            <AccountCircleIcon sx={{ fontSize: 40 }} /> {/* Increase icon size */}
          </Avatar>
          <Typography sx={{color: 'white', display: 'flex', alignItems: 'center'}}>
            { profile && profile.username }
          </Typography>
        </Stack>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} 
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right'}}
        slotProps={{
          paper: {
            sx: { width: 'auto', mt: '0.75%', borderRadius: 0 }
          }
        }}>
        <MenuItem onClick={() => {
          router.push('/profile');
          setAnchorEl(null);
        }}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}