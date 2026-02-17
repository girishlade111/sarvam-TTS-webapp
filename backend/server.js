// Import necessary modules for the Express server
import express from "express"; // Fast, unopinionated, minimalist web framework for Node.js
import fetch from "node-fetch"; // A light-weight module that brings the Fetch API to Node.js
import dotenv from "dotenv"; // Loads environment variables from a .env file
import cors from "cors"; // Provides a Connect/Express middleware that can be used to enable CORS with various options

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Enable CORS for all routes, allowing frontend to make requests
app.use(cors());

// Parse incoming JSON requests, making body data available on req.body
app.use(express.json());

// Define the Sarvam AI Text-to-Speech API endpoint
const SARVAM_URL = "https://api.sarvam.ai/text-to-speech/stream";

/**
 * @route POST /api/tts
 * @description Proxy endpoint to securely stream Text-to-Speech audio from Sarvam AI.
 *              The frontend calls this endpoint, and the backend forwards the request
 *              to Sarvam AI, piping the audio stream back to the frontend.
 */
app.post("/api/tts", async (req, res) => {
    try {
        // Forward the request to the Sarvam AI TTS streaming API
        const sarvamResponse = await fetch(SARVAM_URL, {
            method: "POST", // Use POST method as required by Sarvam API
            headers: {
                // Securely pass the API key from environment variables
                "api-subscription-key": process.env.SARVAM_API_KEY,
                "Content-Type": "application/json" // Specify content type as JSON
            },
            body: JSON.stringify(req.body) // Send the request body as JSON
        });

        // Check if the response from Sarvam AI was successful
        if (!sarvamResponse.ok) {
            // Attempt to read error message from Sarvam API if available
            const errorBody = await sarvamResponse.json().catch(() => ({ message: sarvamResponse.statusText }));
            console.error("Sarvam API Error:", sarvamResponse.status, errorBody);
            // Return an error response to the frontend
            return res.status(sarvamResponse.status).json({ error: "TTS generation failed", details: errorBody });
        }

        // Set headers for audio streaming
        res.setHeader("Content-Type", "audio/mpeg"); // Indicate that an MP3 audio stream is being sent
        // Instruct the client to open a download dialog when the audio is received
        // This is useful for the optional audio download functionality in the frontend.
        res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"');

        // Pipe the audio stream directly from Sarvam AI to the frontend response
        sarvamResponse.body.pipe(res);

    } catch (error) {
        // Handle any server-side errors during the proxy process
        console.error("Server processing error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Start the Express server on port 5000
app.listen(5000, () => console.log("Server running on port 5000"));
