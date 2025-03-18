"use client";
import React, { useState } from 'react';
import { Stack, Typography, Box, TextField } from '@mui/material';
import { useAuth, ProfileProps } from "../context/AuthContext";
import SelectItems from '../components/small-components/SelectItem';
import DateSelector from '../components/small-components/DateSelect';

export default function ProfilePage() {

  const { profile, updateProfile } = useAuth();

  const handleChange = (field: keyof ProfileProps) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      updateProfile({ [field]: event.target.value });
    }
  };
  
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: "translate(-50%, -50%)",
          height: '75vh',
          width: '40%',
          border: '1.5px solid #0066b2',
          borderRadius: "8px",
          padding: '20px 40px 30px 40px',
          mt: '2%'
        }} 
      >
          
        {profile ?
          <Stack sx={{height: '100%', pt: '1%'}} spacing={6.5}>
            <Typography variant='h4' sx={{fontWeight: 'bold'}}>{profile.username}</Typography>
            <TextField value={profile.email} label="Email"/>
            {/* <TextField label="Birth date" value={profile.birthDate} onChange={handleChange("birthDate")}/> */}
            {/* <TextField label="Sex" value={profile.sex}/> */}
            <Stack direction="row" spacing={3}>
              <DateSelector label="Birth date" />
              <SelectItems label="Sex" itemList={['Male', 'Female']} />
            </Stack>
            <Stack direction="row" spacing={3}>
              <TextField label="Height (cm)" type="number" value={profile.height} onChange={handleChange("height")} sx={{width: '100%'}}/>
              <TextField label="Weight (kg)" type="number" value={profile.weight} onChange={handleChange("weight")} sx={{width: '100%'}}/>
            </Stack>
            
            <TextField label="Medical history" multiline rows={10} value={profile.medicalHistory} onChange={handleChange("medicalHistory")}/>
          </Stack>
        :
          <Typography>Sorry, something went wrong loading your profile</Typography>
        }
          
      </Box>
    </>
  );
}