// src/utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@toyshop.local',
    to,
    subject,
    text: text || '',
    html: html || undefined
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendMail, transporter };
