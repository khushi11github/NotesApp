import React, { useState } from "react";
import {
  Box,
  TextareaAutosize,
  Paper,
  Typography,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";

const fontOptions = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];

const NoteEditor = () => {
  const [note, setNote] = useState("");
  const [fontSize, setFontSize] = useState("16px");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  return (
    <Box sx={{ bgcolor: "#fdf6d9", minHeight: "100vh", p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Document Editor
      </Typography>

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Font Size */}
        <FormControl size="small">
          <InputLabel>Size</InputLabel>
          <Select
            value={fontSize}
            label="Size"
            onChange={(e) => setFontSize(e.target.value)}
            sx={{ minWidth: 80 }}
          >
            {["12px", "14px", "16px", "18px", "20px", "24px", "28px"].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Font Color */}
        <label>
          <Typography variant="body2">Color</Typography>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>

        {/* Font Family */}
        <FormControl size="small">
          <InputLabel>Pen</InputLabel>
          <Select
            value={fontFamily}
            label="Pen"
            onChange={(e) => setFontFamily(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {fontOptions.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Save/Share Buttons */}
        <Button variant="contained" color="primary">
          Save
        </Button>
        <Button variant="outlined" color="secondary">
          Share
        </Button>
      </Box>

      {/* Note area */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          p: 2,
          minHeight: 500,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 24px,
            #ccc 25px
          )`,
          bgcolor: "#fff9c4",
          borderRadius: 2,
        }}
      >
        <TextareaAutosize
          minRows={20}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Start writing here..."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            resize: "none",
            background: "transparent",
            lineHeight: "25px",
            fontSize: fontSize,
            color: fontColor,
            fontFamily: fontFamily,
            padding: "8px",
          }}
        />
      </Paper>
    </Box>
  );
};

export default NoteEditor;
