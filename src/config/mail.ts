import nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
    //host: '192.168.1.25',
    service: 'Gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify().then(() => {
    console.log('Ready for send emails');
});