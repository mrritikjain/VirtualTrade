const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    credits: {
    type: Number,
    default: 100000,
  },
}, { timestamps: true});

module.exports = mongoose.model('User', userSchema);
