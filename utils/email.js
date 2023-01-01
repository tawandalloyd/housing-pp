const nodemailer = require('nodemailer');

const sendEmail = async options => {
// create transport
const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

//mail options

const mailOptions = {
    from: 'tawanda charuka <hello@tawanda.io>',
    to : options.email,
    subject: options.subject,
    text: options.message
}

//actually send the email
await transporter.sendMail(mailOptions);

};

module.exports = sendEmail;