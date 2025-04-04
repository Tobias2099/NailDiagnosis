'use client';
import React, {useState} from 'react';
import {Select, MenuItem, FormControl, SelectChangeEvent, InputLabel} from '@mui/material';

interface SelectItemsProps {
  itemList: string[];
  label: string;
  value?: 'Male' | 'Female';
  handleChange?: (event: SelectChangeEvent) => void;
}

export default function SelectItems({itemList, label, value, handleChange} : SelectItemsProps) {

  const [item, setItem] = useState(value || '');

  const makeChanges = (event: SelectChangeEvent) => {
    setItem(event.target.value);  // Update local state first
    if (handleChange) handleChange(event);  // Then call the parent handler if provided
  }

  return (
    <>
      <FormControl sx={{width: '100%'}}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={item}
          label={label}
          onChange={makeChanges}
        >
          {itemList.map((item, index) => (
            <MenuItem value={item} key={index}>{item}</MenuItem>
          ))}
          
        </Select>
      </FormControl>
    </>
  );

}