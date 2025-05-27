const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    NoteId:{
        type: String,
        required: true,
        unique: true,
        index: true
    
    },
    content:{
        type:String,
        default:''
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
