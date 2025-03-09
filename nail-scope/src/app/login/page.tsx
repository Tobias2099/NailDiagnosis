"use client";
import * as React from "react";
import { Box, Typography, Stack, Button, Divider } from '@mui/material';
import FormTextEntry from '../components/small-components/FormTextEntry';
import { FcGoogle } from "react-icons/fc";  // Google icon
import { FaFacebook } from "react-icons/fa"; // Facebook icon

export default function Login() {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: "translate(-50%, -50%)",
          height: '75vh',
          width: '33%',
          border: '1.5px solid #0066b2',
          borderRadius: "8px",
          padding: '20px 40px 30px 40px'
        }} 
      >
        <Stack spacing={3} sx={{height: '100%', justifyContent: 'center' }}>
          <Typography variant='h4' sx={{fontWeight: 'bold' }}>Sign in</Typography>
          <FormTextEntry label="Username" placeholder="John Doe"/>
          <FormTextEntry label="Email" placeholder="user@gmail.com"/>
          <FormTextEntry label="Password" type="password"/>
          <br />
          <Button variant='contained' sx={{height: '7%', fontSize: '100%'}}>Sign in</Button>
          <Divider sx={{ width: "100%", fontSize: "1.2rem" }} textAlign="center">
            or
          </Divider>
          <Button variant='outlined' sx={{height: '7%', textTransform: 'none', fontSize: '120%'}}
            startIcon={<FcGoogle size={24}/>}>
            Sign in with Google
          </Button>
          <Button variant='outlined' sx={{height: '7%', textTransform: 'none', fontSize: '120%'}}
            startIcon={<FaFacebook size={24}/>}>
            Sign in with Facebook
          </Button>
        </Stack>
      </Box>
    </>
  );
}