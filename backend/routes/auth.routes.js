import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

// POST routes (API requests, must use Postman or cURL)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ✅ Add a GET route for browser testing
router.get("/login", (req, res) => {
    console.log("GET /login called");
    res.send("Login Page - GET request works!");
});
router.get("/signup", (req, res) => {
    console.log("GET /signin called");
    res.send("signup Page - GET request works!");
});
router.get("/logout", (req, res) => {
    console.log("GET /logout called");
    res.send("Logout Page - GET request works!");
});

export default router;
