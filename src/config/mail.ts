import nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    service: 'Gmail',
        auth: {
        user: 'itziar.mensa08@gmail.com', // generated ethereal user
        pass: 'bgebtjrxekzztmgd', // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify().then(() => {
    console.log('Ready for send emails');
});