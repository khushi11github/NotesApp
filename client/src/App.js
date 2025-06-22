import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Componet/Register';
import NotesList from './Componet/NotesList';
import Notes from './Componet/Notes';
import Login from './Componet/Login';
import Notepad from './Componet/Notepad';
// import Login from './component/Login';
// import Register from './component/Register';
// import Notes from './component/Notes';
// import NotesList from './component/NotesList';

const App = () => {
  return (
  
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<NotesList />} />
        <Route path="/notes/:noteId" element={<Notes />} />

        <Route path="/notepad" element={<Notepad/>} />
       
      </Routes>
 
  );
};

export default App;
