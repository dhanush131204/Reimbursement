import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

console.log('Testing Nodemailer connection...');
try {
    await transporter.verify();
    console.log('Server is ready to take our messages');
} catch (error) {
    console.error('Connection failed:', error);
}
