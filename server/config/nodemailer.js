import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  logger: true, // enable logs
  debug: true, // enable debug output
});
export default transporter;
