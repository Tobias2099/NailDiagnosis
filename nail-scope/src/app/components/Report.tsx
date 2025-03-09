"use client"
import * as React from "react";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";

interface ReportProps {
  accuracy: number;
  diagnosis: string;
}

export default function Report({accuracy, diagnosis} : ReportProps) {
  return (
    <>
      <Paper elevation={1} sx={{padding: '1%', height: '100%'}}>
        <Typography><strong>Diagnosis:</strong> {diagnosis}</Typography>
        {diagnosis !== "no illness detected" && <Typography><strong>Accuracy:</strong> {accuracy.toFixed(2)}%</Typography>}
      </Paper>
    </>
  )
}