
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { TextareaAutosize, Paper } from "@mui/material"; 

const socket = io("http://localhost:8000");

const Notes = () => {
  const { noteId } = useParams();
  const [notes, setNotes] = useState("");
  const [clicked, setClicked] = useState(false);
  const [emailToshare, setEmailToshare] = useState("");
  const textareaRef = useRef(null);
  const loggedin = localStorage.getItem("loggedin");

  // Fetch note content once on mount or when noteId changes
  useEffect(() => {
    fetch(`http://localhost:8000/api/notes/${noteId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.content || "");
      })
      .catch((err) => console.error("Error fetching note:", err));
  }, [noteId]);

  // Setup socket listeners & join room
  useEffect(() => {
    socket.emit("joinNote", noteId);

    socket.on("receiveNote", (updatedContent) => {
      setNotes(updatedContent);
    });

    return () => {
      socket.off("receiveNote");
      socket.disconnect();
    };
  }, [noteId]);

  const handleNoteChange = (e) => {
    const newText = e.target.value;
    setNotes(newText);
    socket.emit("sendNote", { noteId, content: newText });
  };

  const handleSave = () => {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    const data = {
      content: notes,
      owner: id,
    };
  
    fetch(`http://localhost:8000/api/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Send token here
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save note");
        return res.json();
      })
      .then((result) => {
        console.log("Note updated:", result);
      })
      .catch((error) => console.error("Save error:", error));
  };
  

  const handleShare = () => {
    const data = { noteId, email: emailToshare };
    fetch(`http://localhost:8000/api/notes/${noteId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Share successful:", data);
      })
      .catch((error) => console.error("Error sharing note:", error));
  };

  return (
    <div>
    {loggedin &&  ( <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg m-4"
        onClick={() => setClicked(true)}
      >
        Collaborate
      </button> )}

      {clicked && (
        <div>
          <input
            type="email"
            placeholder="Enter user email"
            value={emailToshare}
            onChange={(e) => setEmailToshare(e.target.value)}
          />
          <button onClick={handleShare}>Share</button>
        </div>
      )}

      <div className="flex justify-center items-center h-screen">
        <div className="w-1/2 h-1/2 border-2 border-gray-300 rounded-lg p-4 shadow-lg">
        <div>
          <div class="notepad"
            ref={textareaRef}
            className="w-full h-full p-2 border border-gray-300 rounded-lg"
            value={notes}
            onChange={handleNoteChange} >
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
                placeholder="Type your notes here..."

                minRows={20}
                value={notes}
                onChange={(e)=>{
                  handleNoteChange(e)
                }}
                    style={{ 
            width: "100%",
            border: "none",
            outline: "none",
            resize: "none",
            background: "transparent",
            lineHeight: "25px",
            // fontSize: fontSize,
            // color: fontColor,
            // fontFamily: fontFamily,
            padding: "8px"
                    }}

               />

               </Paper>

          
         


             
              
            </div>
          
        </div>
          
        </div>
    </div>
      

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg m-4"
        onClick={handleSave}
      >
        Save Note
      </button>
    </div>
  );
};

export default Notes;
