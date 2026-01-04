import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    
  },
  name: {
    type: String,
    required: true,
    
  },

  number: {
    type: Number,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
    
  },
  termsAccepted: {
  type: Boolean,
  default: false
},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
