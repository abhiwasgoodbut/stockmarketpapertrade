import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
// import bcrypt from "bcryptjs";


// API to register user
const generateToken = (id)=> {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export const registerUser = async (req,res) => {
    const {username,name, number, password, repassword} = req.body;
    try {
        const userExits = await User.findOne({number})

        if (userExits) {
            return res.json({success: false, message: "user already exits"})
        }
        if(password !== repassword){
            return res.json({success: false,message: "enter password again" })
        }

        const user = await User.create({username,name,number,password})
        const token = generateToken(user._id)
        res.json({success: true, token})

    } catch (error) {
        console.error(error);
        return res.json({success: false, message: error.message})
         
        
    }
}

// API to login user

export const loginUser = async (req, res) => {
  const { number, password } = req.body;

  try {
    const user = await User.findOne({ number });

    if (!user || user.password !== password) {
      return res.json({
        success: false,
        message: "Invalid mobile number or password"
      });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// API to get user data 
export const getUser = async (req,res) => {
    try {
        const user = req.user;
        return res.json({success: true, user})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}


export const changePassword = async (req, res) => {
  try {
    const user = req.user; // from protect middleware
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 1️⃣ Check required fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    // 2️⃣ Check old password
    if (user.password !== oldPassword) {
      return res.json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    // 3️⃣ New password length
    if (newPassword.length < 6) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // 4️⃣ No spaces allowed
    if (/\s/.test(newPassword)) {
      return res.json({
        success: false,
        message: "Password cannot contain spaces"
      });
    }

    // 5️⃣ New password should be different
    if (newPassword === oldPassword) {
      return res.json({
        success: false,
        message: "New password must be different from old password"
      });
    }

    // 6️⃣ Confirm password match
    if (newPassword !== confirmPassword) {
      return res.json({
        success: false,
        message: "New passwords do not match"
      });
    }

    // 7️⃣ Update password
    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// POST /api/user/accept-terms
export const acceptTerms = async (req, res) => {
  try {
    const user = req.user;

    user.termsAccepted = true;
    await user.save();

    res.json({
      success: true,
      message: "Terms accepted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};