'use client';

import * as React from "react";
import { useState, useRef } from "react";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ClearIcon from "@mui/icons-material/Clear";
import Report from "./components/Report";
import {useAuth} from "./context/AuthContext";
import Chat from './components/Chat';
import { useChat, MessageType } from "./context/ChatContext";

// Hidden File Input Styling
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Home() {
  // const { isLoggedIn } = useAuth();
  const { isChat, messageHistory, setMessageHistory } = useChat();

  const imageWidth = "50%";
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(Date.now()); 

  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      console.log("No image uploaded");
      return;
    }

    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file)); 
    } else {
      alert("Only image files are allowed!");
    }
  };

  // Reset Image Preview & Clear File Input
  const handleCancel = () => {
    setImagePreview(null);
    setInputKey(Date.now());
  };

  const handleDiagnosis = async () => {
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Please upload an image first!");
      return;
    }

    const file = fileInput.files[0]; // Get the uploaded image

    // Prepare FormData to send the image
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/diagnose", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get diagnosis");
      }

      const data = await response.json();
      // alert(`Diagnosis: ${data.diagnosis}`); // ✅ Display diagnosis result
      setDiagnosis(data.diagnosis);
      setAccuracy(data.confidence);

      const updatedMessages: MessageType[] = [
        {
          role: 'system',
          content: `Diagnosis: ${data.diagnosis}, Diagnosis accuracy: ${data.confidence}`
        },
        ...(messageHistory || [])
      ];

      setMessageHistory(updatedMessages);
      
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing the image");
    }
  }; 

  return (
    <>
      <Stack direction="row" sx={{height: "99.5vh"}}>
        <Stack sx={{ position: "absolute", top: 0, bottom: "20%", left: 0, right: 0 }}>
          <Box sx={{ mt: diagnosis? "9%" : "14%" }}>
          <Paper
            elevation={2}  // Slightly increases softness
            sx={{
              border: !imagePreview ? "1px solid #0066b2" : "none",  // ✅ Softer border
              width: imageWidth,
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              backgroundColor: !imagePreview ? "#f5f5f5" : "transparent",
              backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {!imagePreview && <Typography variant="body1" color="gray">No image selected</Typography>}
          </Paper>
            <Stack direction="row" sx={{ margin: "auto", width: imageWidth, mt: '1.5%' }} spacing={2.5}>
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Image
                <VisuallyHiddenInput
                  key={inputKey} // ✅ Forces input to reset
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                />
              </Button>

              {imagePreview &&
                (
                <>
                  <Button 
                    variant="contained" 
                    sx={{ backgroundColor: "#03C03C" }} 
                    startIcon={<AnalyticsIcon />}
                    onClick={handleDiagnosis}
                  >
                    Diagnose
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#AA0000", ml: "auto" }}
                    startIcon={<ClearIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Stack>

            {diagnosis && accuracy && 
              <Box sx={{width: '50%', margin: 'auto', mt: '2%', height: '15%'}}>
                <Report accuracy={accuracy} diagnosis={diagnosis}/>
              </Box>
            }
          </Box>
        </Stack>
        {isChat && <Chat />}
      </Stack>
    </>
  );
}
