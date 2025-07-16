const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    NoteId:{
        type: String,
        required: true,
        unique: true,
        index: true
    
    },
    NoteTitle:{
        type: String,
        default: 'Untitled Note'
    },
    folder:{
        type: String,
        default: null // Default to no folder
    },
    content:{
        type:String,
        default:''
    },
    heading:{
        type: String,
        default: 'Untitled Note'
    },
    color: {
        type: String,
        default: '#ffffff' // Default color is white
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    sharedWith:{
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Note', NoteSchema);
