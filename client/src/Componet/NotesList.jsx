import { blue } from '@mui/material/colors';
import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const [heading, setHeading] = useState("");

  useEffect(()=>{
    if(!userEmail) {
      navigate("/login");
    }

    fetch(`http://localhost:8000/api/notes?email=${userEmail}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched notes:", data);  // <--- Add this to debug the structure
      setNotes(data);
    })
    .catch((err) => console.error(err));
}, [navigate, userEmail]);

const handleCreateNote = async () => {



  
  const noteId = uuidv4(); // generate unique noteId
  const userId = localStorage.getItem("userId");
  console.log("userId before creating note:", userId);
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8000/api/notes/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ noteId: noteId, owner: userId,heading: heading })
  });
  
  const data = await res.json();
  if (res.ok) {
    alert(data.message);
  } else {
    alert(data.error);
  }
};
  return (
    <div>
       <div className="p-6">
      <h1 className="text-2xl mb-4 font-bold">Your Notes</h1>

      <button
        // onClick={handleCreateNote}
        onClick={() => setClicked(!clicked)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        + Create Note
      </button>
      {clicked && (
       <div>
        <input type="text" placeholder="Enter note title" className="border p-2 rounded mb-4" onChange={(e)=>setHeading(e.target.value)} />
        <button
          onClick={handleCreateNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note.NoteId}
            onClick={() => navigate(`/notes/${note.NoteId}`)}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
          >
            <h1 className="font-semibold mb-2"  style={{
    color: "blue",
    fontSize: "36px",
    fontFamily: "'Brush Script MT', cursive",
    fontWeight: "600",
    marginBottom: "1rem"
  }}>
  {note.heading}
</h1>

            <h2 className="font-semibold mb-2">Note ID: {note.NoteId}</h2>
            <p className="text-gray-700">{note.content?.slice(0, 100) || "Empty Note"}</p>
          </div>
        ))}
      </div>
    </div>
      
    </div>
  )
}

export default NotesList
