import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const customMailer = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PW,
  },
});

export default customMailer;
