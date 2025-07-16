const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    folderId:{type:String,required : true,unique:true,index:true},
    name:{type:String, required:true},
    color:{type:String,default:'#a5becfff'}, // Default color is white
    isFav :{type:Boolean,default:false},
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        required: true
    },
    parentId:{
        type: String,
        default: null
    },
    tags: {
        type: [String],
        default: []
    },
    sharedWith:{
        type:[],
        default: []
    }
    

});

module.exports = mongoose.model('Folder', FolderSchema);