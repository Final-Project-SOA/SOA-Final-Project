require('dotenv').config({
    path: require('path').resolve(__dirname, '../../.env')
});
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

async function sendAppointmentEmail(data) {

    const mailOptions = {

        from: process.env.EMAIL_USER,

        to: data.email,

        subject: `Appointment confirmation with ${data.doctor}`,

        html: `

            <h2>Hello ${data.patient},</h2>

            <p>
                Your medical appointment has been successfully scheduled.
            </p>

            <h3>Appointment details:</h3>

            <ul>
                <li><b>Doctor:</b> ${data.doctor}</li>
                <li><b>Date:</b> ${data.date}</li>
            </ul>

            <p>
                Please arrive 10 minutes before your appointment.
            </p>

            <br>

            <p>
                Best regards,<br>
                Smart Clinic Team
            </p>

        `
    };

    await transporter.sendMail(mailOptions);

    console.log('AI email sent successfully');
}

module.exports = sendAppointmentEmail;