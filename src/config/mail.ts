import nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    service: 'Gmail',
        auth: {
        user: 'h24@flightlinebcn.com', // generated ethereal user
        pass: 'mqpwijsqjotkhthw', // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify().then(() => {
    console.log('Ready for send emails');
});