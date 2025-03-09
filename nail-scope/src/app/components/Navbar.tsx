"use client"
import * as React from 'react';
import { useRouter } from "next/navigation";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from './Profile';
import { Stack } from "@mui/material";

export default function Navbar() {

  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textTransform: 'none' }}>
            Anailytic
          </Typography>

          {isLoggedIn ?
            <ProfileDropdown />
          : 
          <>
            <Button color="inherit" onClick={() => router.push('../register')} sx={{textTransform: 'none', fontSize: '100%'}}>Register</Button>
            <Button color="inherit" onClick={() => router.push('../login')} sx={{textTransform: 'none', fontSize: '100%'}}>Login</Button>
          </>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}