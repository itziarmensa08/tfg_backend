import nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 597,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify().then(() => {
    console.log('Ready for send emails');
});