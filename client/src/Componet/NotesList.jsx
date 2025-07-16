import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  Box,
} from "@mui/material";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const [heading, setHeading] = useState("");

  // ✅ Reusable fetchNotes function
  const fetchNotes = () => {
    fetch(`http://localhost:8000/api/notes?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => console.error(err));
  };

  // ✅ useEffect uses fetchNotes
  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
    } else {
      fetchNotes();
    }
  }, [navigate, userEmail]);

  const handleCreateNote = async () => {
    const noteId = uuidv4();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/notes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ noteId, owner: userId, heading }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setHeading("");        // ✅ Clear input
      setClicked(false);     // ✅ Hide create box
      fetchNotes();          // ✅ Refresh note list
    } else {
      alert(data.error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Notes
      </Typography>

      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        onClick={() => setClicked(!clicked)}
      >
        + Create Note
      </Button>

      {clicked && (
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            label="Enter note title"
            variant="outlined"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleCreateNote}>
            Create
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {notes.map((note) => (
          <Grid item xs={12} md={6} key={note.NoteId}>
            <Paper
              elevation={3}
              onClick={() => navigate(`/notes/${note.NoteId}`)}
              sx={{
                p: 2,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontFamily: "'Brush Script MT', cursive",
                  color: "blue",
                  fontWeight: "bold",
                }}
              >
                {note.heading}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Note ID: {note.NoteId}
              </Typography>
              <Typography variant="body2">
                {note.content?.slice(0, 100) || "Empty Note"}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NotesList;
