import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
console.log(process.env.USERNAME, process.env.PASS);
const app = express();
const port = 5001;

// Enable CORS
app.use(cors({ origin: "http://localhost:3000" }));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (you may need to adjust the path)
app.use(express.static("public"));

// Handle form submissions
app.post("/submit-form", async (req, res) => {
  const { name, email, message } = req.body;

  // Create a transporter using your email service credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASS,
    },
  });

  // Define the email content
  const mailOptions = {
    from: email,
    to: process.env.USERNAME,
    subject: "New Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).send("Form submitted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => res.json("my api is running"));
