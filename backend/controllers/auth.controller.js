import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ username }).exec();
        if (userExists) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Set profile picture based on gender
        const boy = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girl = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const genderLower = gender.toLowerCase();
        const profilePic = genderLower === "male" ? boy : girl;

        // Create new user
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender: genderLower,
            profilePic,
        });

        // Save user and generate token
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic
        });

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) { // ✅ Fixed this condition
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error in login controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async(req, res) => {
    try{
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({ message: "Logged out successfully" });
    }
    catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
}
};
