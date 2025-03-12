const nodemailer = require('nodemailer');
const path = require('path');

module.exports = async function mail(to, subject, template, context) {
    // Importing nodemailer-express-handlebars dynamically for ESM compatibility
    const { default: hbs } = await import('nodemailer-express-handlebars');

    // Creating the transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.COMMUNICATIONS_EMAIL,
            pass: process.env.COMMUNICATIONS_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Configuring handlebars template engine
    transporter.use('compile', hbs({
        viewEngine: {
            extname: '.hbs',
            layoutsDir: path.resolve(__dirname, '../views'), // Use a separate layouts folder if needed
            defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, '../views'), // Set base views directory
        extName: '.hbs',
    }));

    // Mail options
    const mailOptions = {
        from: `"School Thrifties" <${process.env.COMMUNICATIONS_EMAIL}>`,
        to,
        subject,
        template, // Template name without extension
        context,  // Dynamic content for template
    };

    // Sending email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (err) {
        console.error('Error sending email:', err);
        throw err; // Rethrow error for external handling
    }
};
