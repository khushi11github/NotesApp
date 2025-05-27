
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const Notes = () => {
  const { noteId } = useParams();
  const [notes, setNotes] = useState("");
  const [clicked, setClicked] = useState(false);
  const [emailToshare, setEmailToshare] = useState("");
  const textareaRef = useRef(null);

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
    const data = {
      content: notes,
      owner: id,
    };

    fetch(`http://localhost:8000/api/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg m-4"
        onClick={() => setClicked(true)}
      >
        Collaborate
      </button>
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
          <textarea
            ref={textareaRef}
            className="w-full h-full p-2 border border-gray-300 rounded-lg"
            placeholder="Type your notes here..."
            value={notes}
            onChange={handleNoteChange}
          />
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
