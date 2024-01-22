import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
console.log(process.env.USERNAME, process.env.PASS);
const app = express();
const port = 5001;

// Enable CORS
app.use(cors({ origin: "http://3.82.151.217:5001" }));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (you may need to adjust the path)
app.use(express.static("public"));

// Handle form submissions
app.post("/submit-form", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Forward the form data to the external API
    const apiResponse = await fetch("http://3.82.151.217:5001/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (apiResponse.ok) {
      console.log("Form submitted successfully!");
      res.status(200).send("Form submitted successfully");
    } else {
      console.error("Form submission failed.", await apiResponse.text());
      res.status(apiResponse.status).send("Form submission failed");
    }
  } catch (error) {
    console.error("An error occurred during form submission:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => res.json("my API is running"));
