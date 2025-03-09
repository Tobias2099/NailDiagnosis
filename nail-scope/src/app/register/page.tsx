"use client";
import React, {useState} from "react";
import { Box, Typography, Stack, Button, Divider } from '@mui/material';
import FormTextEntry from '../components/small-components/FormTextEntry';
import { FcGoogle } from "react-icons/fc";  // Google icon
import { FaFacebook } from "react-icons/fa"; // Facebook icon
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Register() {

  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);

    const requestBody = {
      username,
      email,
      password
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please log in.");
        login();
        router.push('../')
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  }

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
          <Typography variant='h4' sx={{fontWeight: 'bold' }}>Sign up</Typography>
          <FormTextEntry label="Username" placeholder="John Doe" onChange={(e) => setUsername(e.target.value)}/>
          <FormTextEntry label="Email" placeholder="user@gmail.com" onChange={(e) => setEmail(e.target.value)}/>
          <FormTextEntry label="Password" type="password" onChange={(e) => setPassword(e.target.value)}/>
          <br />
          <Button variant='contained' sx={{height: '7%', fontSize: '100%'}} onClick={handleSignUp}>Sign up</Button>
          <Divider sx={{ width: "100%", fontSize: "1.2rem" }} textAlign="center">
            or
          </Divider>
          <Button variant='outlined' sx={{height: '7%', textTransform: 'none', fontSize: '120%'}}
            startIcon={<FcGoogle size={24}/>}>
            Sign up with Google
          </Button>
          <Button variant='outlined' sx={{height: '7%', textTransform: 'none', fontSize: '120%'}}
            startIcon={<FaFacebook size={24}/>}>
            Sign up with Facebook
          </Button>
        </Stack>
      </Box>
    </>
  );
}