import React from 'react'
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");
const Notes = () => {
    const { noteId } = useParams();
    const [notes, setNotes] = useState("");
    const [owner, setOwner] = useState("");
    const [clicked, setClicked] = useState(false);
    const [emailToshare, setEmailToshare] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
      // const user = JSON.parse(localStorage.getItem("user"));
      
      // if (user && user.id) {
      //   console.log("User ID from localStorage:", id);
      //    // Use `id`, NOT `_id`
      // }
      socket.emit('joinNote', { noteId: noteId });
      socket.on('receiveNote',(updatedcontent)=>{
        setNotes(updatedcontent);
      });
      return()=>{
        socket.disconnect();
      }
    }, [noteId]);
   

    const handleNoteChange = (e) => {
      const newText = e.target.value;
      setNotes(newText);
      socket.emit("sendNote", { noteId, content: newText });
    };

    function handleSave() {
      const id= localStorage.getItem("userId");

      const data = {
        content: notes,
        owner: id, // must match Mongoose schema field
      };
    
      fetch(`http://localhost:8000/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update note", response);
          }
          return response.json();
        })
        .then((result) => {
          console.log("Note updated:", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    
    // useEffect(() => {
    //     socket.
   function handleshare() {
        const data = {
            noteId: noteId,

            email: emailToshare
        }
        fetch(`http://localhost:8000/api/notes/${noteId}/share`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Share successful:", data);
        })
        .catch((error) => {
            console.error("Error sharing note:", error);
        });
    }

  return ( 
    <div>
       <div>

         <button className='bg-blue-500 text-white px-4 py-2 rounded-lg m-4' onClick={() => {
            // socket.emit('joinNote',{ noteId: noteId, owner: owner});
            setClicked(true);
            // if (textareaRef.current) {
            //     textareaRef.current.focus();
            // }
         }} >Collaborate</button>
         {clicked && (
          <div>
          <input type="email" placeholder='Enter users email' value={emailToshare} onChange={(e)=>setEmailToshare(e.target.value)}/>
          <button onClick={handleshare}>Share</button>
          </div>
         )}
      



        </div>
        <div className='flex justify-center items-center h-screen'>
        <div className='flex justify-center items-center h-screen'>
        <div className='w-1/2 h-1/2 border-2 border-gray-300 rounded-lg p-4 shadow-lg'>
          <textarea
            ref={textareaRef}
            className='w-full h-full p-2 border border-gray-300 rounded-lg'
            placeholder='Type your notes here...'
            value={notes}
            onChange={handleNoteChange}
          />
        </div>
      </div>
    </div>


<button className='bg-green-500 text-white px-4 py-2 rounded-lg m-4' onClick={handleSave}>Save Note </button>

        
      
    </div>
  )
}

export default Notes
