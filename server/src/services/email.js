// email.js
import nodemailer from "nodemailer";

// 1. Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_PASS, // your Gmail App Password (not your normal password)
  },
});

// 2. Function to send reset password email
export const sendResetPasswordEmail = async (toEmail, resetToken) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
