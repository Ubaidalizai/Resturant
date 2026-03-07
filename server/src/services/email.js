// backend/services/email.js
import nodemailer from "nodemailer";

// Configure your email account
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: "ansar.stack@gmail.com",   // your email
    pass: "zmjktibrxzdearbh",    // email password or app password
  },
});

// Function to send JWT token for password reset
export const sendResetToken = async (toEmail, jwtToken) => {
  try {
    const resetLink = `http://localhost:5173/reset-password?token=${jwtToken}`; // user clicks this link
    const mailOptions = {
      from: "ansar.stack@gmail.com",
      to: toEmail,
      subject: "Password Reset Request",
      text: `You requested to reset your password. Use this link: ${resetLink}`,
      html: `<p>You requested to reset your password.</p>
             <p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Reset JWT token sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending JWT token:", error);
    return { success: false, error };
  }
};