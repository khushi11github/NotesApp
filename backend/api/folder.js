const express = require('express');
const router = express.Router();
const Folder = require('../model/Folder');
const authenticateToken = require('../middleware/auth');
const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const folder = new Folder({
      folderId: uuidv4(),
      name: req.body.name,
      color: req.body.color || '#a5becfff',
      tags: req.body.tags || [],
      owner: req.user.id
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/myfolders', authenticateToken, async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.id });
    res.json(folders); // ✅ return the folders
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put('/:folderId', authenticateToken, async (req, res) => {
  try {
    const folder = await Folder.findOne({ folderId: req.params.folderId });
    if (!folder || folder.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    folder.name = req.body.name || folder.name;
    folder.color = req.body.color || folder.color;
    folder.isFavorite = req.body.isFavorite !== undefined ? req.body.isFavorite : folder.isFavorite;
    folder.tags = req.body.tags || folder.tags;
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.delete('/:folderId', authenticateToken, async (req, res) => {
  try {
    await Folder.findOneAndDelete({ folderId: req.params.folderId, owner: req.user.id });
    res.json({ message: 'Folder deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;