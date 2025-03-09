'use client';
import React, { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProfileDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton onClick={handleClick} sx={{ padding: 0 }}>
        <Stack direction="row" spacing={1}>
          <Avatar sx={{ width: 40, height: 40 }}> 
            <AccountCircleIcon sx={{ fontSize: 40 }} /> {/* Increase icon size */}
          </Avatar>
          <Typography sx={{color: 'white', display: 'flex', alignItems: 'center'}}>
            John Doe
          </Typography>
        </Stack>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} 
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right'}}
        slotProps={{
          paper: {
            sx: { width: '7.25%', mt: '0.75%', borderRadius: 0 }
          }
        }}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
}