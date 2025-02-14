import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import env from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "./models/user.js";

const app = express();
const port = process.env.BASE_PORT || 3000;
const saltRounds = 10;
env.config();

const connection = mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, password, fullName, gender, dateOfBirth, country } = req.body;

    //only needs to check password length as other datas are vallidated by mongoose
    if (password.length < 8) {
        return res.json({ msg: "Password must be at least 8 characters" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ msg: "User already exists, try signing in" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            fullName,
            gender,
            dateOfBirth,
            country
        });

        await newUser.save();

        //send registration confirmation
        res.json({ msg: "Registration successful", UserInfo: newUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });

        //if user not found
        if (!user) {
            return res.json({ msg: "User Not Found, Create an Account", token: false });
        }

        // Compare hashed passwords
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.json({ msg: "Incorrect Password", token: false });
        }

        // Generate JWT Token that expires in 5 minutes
        const token = jwt.sign(
            { username: user.username, fullName: user.fullName, userid: user._id },
            process.env.SESSION_SECRET,
            { expiresIn: 60 * 5 }
        );

        res.json({ msg: "Login Successful", Token: token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

app.get("/searchuser", async (req, res) => {
    const username = req.body.username;
    
    //get auth header
    const authHeader = req.headers["authorization"];

    //if header is valid or not
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Unauthorized, no token provided" });
    }

    //extract token
    const token = authHeader.split(" ")[1];

    try {
        //verify token
        jwt.verify(token, process.env.SESSION_SECRET, async function (err, user) {
            //if token invalid
            if (err) {
                return res.json({
                    msg: "Invalid Token",
                    user: null
                });
            }
            //search user
            const result = await User.findOne({ username: username }).select("-password");
            //if user found
            if (result) {
                return res.json({
                    msg: "User Found",
                    user: user,
                    queriedUser_Info: result
                });
            }
            //if user not found
            else {
                return res.json({
                    msg: "User Not Found",
                    user: user
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: err });
    }

})


app.listen(port, () => {
    console.log(`listening at port ${port}`)
});
