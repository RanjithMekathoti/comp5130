const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 8000;

app.use(express.json());

app.post('/send-message', async (req, res) => {
    let { name, email, country, remarks } = req.body;

    // Set up Nodemailer transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mekathotiranjithkumar@gmail.com',
            pass: 'ABCabc123$'
        }
    });

    // Set up email data
    let mailOptions = {
        from: email, // sender address
        to: 'mekathotiranjithkumar@gmail.com', // receiver address
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nCountry: ${country}\nRemarks: ${remarks}`
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
