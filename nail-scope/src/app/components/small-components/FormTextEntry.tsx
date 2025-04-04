import * as React from 'react';
import { Stack, Typography, TextField } from '@mui/material';

interface FormTextEntry {
  label: string;
  placeholder?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function FormTextEntry({label, type, placeholder, onChange, value} : FormTextEntry) {
  return (
    <Stack spacing={1}>
      <Typography>{label}</Typography>
      <TextField type={type} placeholder={placeholder} onChange={onChange} value={value}/>
    </Stack>
  )
}