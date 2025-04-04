import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DateSelectorProps {
  label: string;
  value?: Date | null;
  handleChange: (newDate: Date | null) => void;
}

export default function DateSelector({label, value, handleChange}: DateSelectorProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label={label} sx={{width: '100%'}} value={value ? dayjs(value) : null} 
      onChange={(newValue: Dayjs | null) => handleChange(newValue ? newValue.toDate() : null)}/>
    </LocalizationProvider>
  );
}