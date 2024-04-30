const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    age:{
        type:Number,
        required: true,
    }, 
    city:{
        type: String,
    },
    totalFriends:{
        type: Number,
        required: true,
    },
    friends:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);