const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const authenticateToken = require("../middleware/auth"); 

const Note = require("../model/Note");
const User = require("../model/User");
const { v4: uuidv4 } = require("uuid");
// GET /notes?email=user@example.com
router.get("/", async (req, res) => {
  const { email } = req.query;

  try {
    // Step 1: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Find notes by user ID
    const notes = await Note.find({ owner: user._id });
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create", authenticateToken, async (req, res) => {
  try {
    const newNote = new Note({
      NoteId: uuidv4(),  // generate unique ID here
      content: "",
      heading: req.body.heading || "Untitled Note",
      sharedWith: [],
      owner: req.user.id
    });

    await newNote.save();

    res.status(201).json({
      message: "Note created successfully",
      noteId: newNote.NoteId
    });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET: Fetch a note by noteId
router.get("/:noteId", async (req, res) => {
    const { noteId } = req.params;
  
    try {
      const note = await Note.findOne({ NoteId: noteId });
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
  
      res.status(200).json(note);
    } catch (err) {
      console.error("Error fetching note:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
// PUT: Update a note's content and owner
// PUT /api/notes/:noteId
router.put("/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;
  const owner = req.user.id; // Use authenticated user's ID
  // if (!content) {
  //   return res.status(400).json({ error: "Content is required" });
  // }
  // if (!noteId) {
  //   return res.status(400).json({ error: "NoteId is required" });
  // }
  // if (!owner) {
  //   return res.status(400).json({ error: "Owner is required" });
  // }
  // if(owner){
  //   console.log("Owner ID:", owner);
  // }

  

  try {
    // console.log("Finding note with NoteId:", noteId);
    const note = await Note.findOne({ NoteId: noteId });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.content = content;
    note.owner = owner;
    await note.save();

    res.status(200).json({ message: "Note updated", note });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json(err);
  }
});



  
  router.post("/:noteId/share", async (req, res) => {
    const {noteId} = req.params;
    const {email} = req.body;
    try{
        const note = await Note.findOne({NoteId: noteId});
        if(!note){
            return res.status(404).json({error: "Note not found"});
        }
        // if(note.sharedWith.includes(email)){
        //     return res.status(400).json({error: "Note already shared with this user"});
        // }
        if (!note.sharedWith.includes(email)) {
            note.sharedWith.push(email);
            await note.save();
          } else {
            console.log("Note already shared, skipping DB update");
          }
          
          // Email is always sent regardless
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }
    });
          
          const noteLink = `http://localhost:3000/notes/${noteId}`;
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Note Shared with You',
            text: `A note has been shared with you. You can view it here: ${noteLink}`
          };
          
          await transporter.sendMail(mailOptions);
          
          res.status(200).json({ message: "Note shared successfully", note });
          

    } catch(err){
        console.error("Error sharing note:", err);
        res.status(500).json({ error: "Internal server error" });
    }

  });





  

  module.exports = router;




