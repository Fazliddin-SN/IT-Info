import { createTransport } from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendMail(userMail, message) {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: userMail,
      subject: "OTP Manager",
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully:", info.response);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

// sendMail("fazliddinsalohiddinov24@gmail.com");
