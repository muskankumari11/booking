import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"; // Make sure path is correct
import connectToMongoDB from "./db/connectToMongoDB.js";
import Message from "./models/message.model.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
// Middleware to parse JSON requests
app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);


app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running at port ${PORT}`);
});
