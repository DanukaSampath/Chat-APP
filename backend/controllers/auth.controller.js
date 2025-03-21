import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; 
import generateTokenAndSetCookie from "../../utils/generateToken.js";


export const signup = async (req, res) => {
    try
    {
        console.log("Request Body:", req.body); // Debugging line

        const { fullname, username, password, confirmPassword, gender } = req.body;

        if(password !== confirmPassword) 
        {
            return res.status(400).json({message: "Password do not match"});
        }

        const user = await User.findOne({username});

        if(user) 
        {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        
        const newUser = new User({
            fullname,
            username,
            password: hashedPassword, 
            gender,
            profilepic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if(newUser)
        {
            //generate jwt token
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            });
        }

        else
        {
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) 
    {
        console.log('Error on signup: ', error.message);
        res.status(500).json({message: "Something went wrong"});
    }
}

export const login = async (req, res) => {
    try
    {
        const { username, password } = req.body;
        const   user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect)
        {
            return res.status(400).json({error: "Invalid Username or Password"});
        }

        //generate jwt token
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
        });
    }
    catch (error) 
    {
        console.log('Error in Login Controller', error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = (req, res) => {

    try
    {
        res.clearCookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    }

    catch (error) 
    {
        console.log('Error in Logout Controller', error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

 