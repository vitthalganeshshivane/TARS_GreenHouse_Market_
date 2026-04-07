
import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/db.js"


const app = express();
const PORT = 3000;

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    })
})

const startServer = async () => {
    try {
        await db();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`)
        });
    } catch (error) {
        console.log("Error in starting server")
    }
}



startServer();