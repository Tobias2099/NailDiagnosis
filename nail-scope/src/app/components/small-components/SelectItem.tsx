'use client';
import React, {useState} from 'react';
import {Select, MenuItem, FormControl, SelectChangeEvent, InputLabel} from '@mui/material';

interface SelectItemsProps {
  itemList: string[];
  label: string;
}

export default function SelectItems({itemList, label} : SelectItemsProps) {

  const [value, setValue] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  }

  return (
    <>
      <FormControl sx={{width: '100%'}}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={handleChange}
        >
          {itemList.map((item, index) => (
            <MenuItem value={item} key={index}>{item}</MenuItem>
          ))}
          
        </Select>
      </FormControl>
    </>
  );

}