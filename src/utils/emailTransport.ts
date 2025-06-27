import Transport from 'winston-transport';
import { transporter } from '../config/mail';

class EmailOnErrorTransport extends Transport {
    constructor(opts?: any) {
        super(opts);
    }

    log(info: any, callback: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        if (info.level === 'error') {

            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: process.env.USER_EMAIL,
                subject: '[ERROR] - ' + info.timestamp,
                text: `${info.timestamp} [${info.level}]: ${info.message}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending error email:', error);
                } else {
                    console.log(`Email sent to ${process.env.USER_EMAIL}: ${info.response}`);
                }
            });
        }

        callback();
    }
}

export default EmailOnErrorTransport;