"use client";
import React, { useEffect } from 'react';
import { Stack, Typography, Box, TextField, Button, SelectChangeEvent } from '@mui/material';
import { useAuth, ProfileProps } from "../context/AuthContext";
import SelectItems from '../components/small-components/SelectItem';
import DateSelector from '../components/small-components/DateSelect';
import { useSearchParams, useRouter } from "next/navigation";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const { profile, updateProfile, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const picture = searchParams.get('picture'); //still need to implement profile picture
    const sex = searchParams.get('sex') || '';
    const medicalHistory = searchParams.get('medicalHistory') || '';

    // Convert birthDate to Date (if valid)
    const birthDateStr = searchParams.get('birthDate');
    const birthDate = birthDateStr ? new Date(birthDateStr) : null;

    // Convert height and weight to numbers
    const heightStr = searchParams.get('height');
    const weightStr = searchParams.get('weight');
    const height = heightStr ? Number(heightStr) : null;
    const weight = weightStr ? Number(weightStr) : null;

    if (email && username) {
      login(
        {
          username: username,
          email: email,
          birthDate: birthDate,
          sex: (sex === 'Male' || sex === 'Female') ? sex : null,
          height: height,
          weight: weight,
          medicalHistory: medicalHistory,
        }
      )

      router.replace('/profile');
    }

  }, []);

  const handleChange = (field: keyof ProfileProps) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      updateProfile({ [field]: event.target.value });
    }
  };

  // Date change handler for DateSelector
  const handleDateChange = (date: Date | null) => {
    if (profile) {
      updateProfile({ "birthDate": date });
    }
  };

  // Sex selection handler for SelectItems
  const handleSexChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    const sex: 'Male' | 'Female' | null = (value === 'Male' || value === 'Female') ? value : null; 
    if (profile) {
      updateProfile({ "sex": sex });
      console.log("SEX: ", profile.sex);
    }
  };



  const saveProfile = async (profileData: ProfileProps): Promise<string | null> => {
    try {
      const formattedProfile = {
        ...profileData,
        birthDate: profileData.birthDate instanceof Date ? profileData.birthDate.toISOString().split('T')[0] : null,
      };

      const response = await fetch("http://localhost:5000/api/save_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedProfile),
      });
  
      if (!response.ok) {
        let errorMessage = "Failed to save profile";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          console.error("Failed to parse error response");
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log("Profile saved successfully:", data.message);
      return data.message;
  
    } catch (err) {
      console.error("Error saving profile: ", err);
      return null;
    }
  };
  
  console.log(profile);
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
          <Stack sx={{height: '100%', pt: '1%'}} spacing={5.5}>
            <Typography variant='h4' sx={{fontWeight: 'bold'}}>{profile.username}</Typography>
            <TextField value={profile.email} label="Email"/>
            <Stack direction="row" spacing={3}>
              <DateSelector label="Birth date" value={profile.birthDate || undefined} handleChange={handleDateChange}/>
              <SelectItems label="Sex" itemList={['Male', 'Female']} value={profile.sex || undefined} handleChange={handleSexChange}/>
            </Stack>
            <Stack direction="row" spacing={3}>
              <TextField label="Height (cm)" type="number" value={profile.height || undefined} onChange={handleChange("height")} sx={{width: '100%'}}/>
              <TextField label="Weight (kg)" type="number" value={profile.weight || undefined} onChange={handleChange("weight")} sx={{width: '100%'}}/>
            </Stack>
            
            <TextField label="Medical history" multiline rows={8} value={profile.medicalHistory || undefined} onChange={handleChange("medicalHistory")}/>
            <Stack direction="row" justifyContent="space-between">
              <Button variant="contained" sx={{width: '25%', backgroundColor: '#AA0000'}} onClick={() => router.push('/')}>Back</Button>
              <Button variant="contained" sx={{width: '25%'}} onClick={() => saveProfile(profile)}>Save</Button>
            </Stack>
          </Stack>
        :
          <Typography>Not logged in</Typography>
        }
          
      </Box>
    </>
  );
}