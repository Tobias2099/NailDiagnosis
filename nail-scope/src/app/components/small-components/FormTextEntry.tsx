import * as React from 'react';
import { Stack, Typography, TextField } from '@mui/material';

interface FormTextEntry {
  label: string;
  placeholder?: string;
  width?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormTextEntry({label, width, type, placeholder, onChange} : FormTextEntry) {
  return (
    <Stack spacing={1}>
      <Typography>{label}</Typography>
      <TextField type={type} placeholder={placeholder} onChange={onChange}/>
    </Stack>
  )
}