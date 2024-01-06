const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    userName:{
        type: String,
        required: true
    },
    password:{
        type: String, 
        required: true
    },
    profileImg: {
        type: String,
        default:"https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&q=60&h=220&w=440"
    }
    
}, {timestamps: true} );

mongoose.model("UserModel", userSchema);