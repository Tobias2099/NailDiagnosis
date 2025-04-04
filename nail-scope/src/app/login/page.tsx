"use client";
import React, {useState} from "react";
import { Box, Typography, Stack, Button, Divider } from '@mui/material';
import FormTextEntry from '../components/small-components/FormTextEntry';
import { FcGoogle } from "react-icons/fc";  // Google icon
import { FaFacebook } from "react-icons/fa"; // Facebook icon
import { useAuth } from "../context/AuthContext"; 
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);

    if (!username || !email || !password) {
      setError('Missing required fields');
      return;
    }

    const requestBody = {
      username,
      email,
      password
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        login(data.user);
        router.push('/')
      } else {
        setError(data.error || "Login failed");
        alert(error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      alert(error);
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
          <Typography variant='h4' sx={{fontWeight: 'bold' }}>Sign in</Typography>
          <FormTextEntry label="Username" placeholder="John Doe" onChange={(e) => setUsername(e.target.value)}/>
          <FormTextEntry label="Email" placeholder="user@gmail.com" onChange={(e) => setEmail(e.target.value)}/>
          <FormTextEntry label="Password" type="password" onChange={(e) => setPassword(e.target.value)}/>
          <br />
          <Button variant='contained' sx={{height: '7%', fontSize: '100%'}} onClick={handleSignIn}>Sign in</Button>
          <Divider sx={{ width: "100%", fontSize: "1.2rem" }} textAlign="center">
            or
          </Divider>
          <Button variant='outlined' sx={{height: '7%', textTransform: 'none', fontSize: '120%'}}
            startIcon={<FcGoogle size={24}/>} onClick={() => window.location.href = "http://localhost:5000/api/auth/login"}>
            Sign in with Google
          </Button>
          <Button variant='outlined' sx={{height: '7%', textTransform: 'none', fontSize: '120%'}}
            startIcon={<FaFacebook size={24}/>} 
            onClick={() => window.location.href = "http://localhost:5000/api/auth/facebook/login"}>
            Sign in with Facebook
          </Button>
        </Stack>
      </Box>
    </>
  );
}