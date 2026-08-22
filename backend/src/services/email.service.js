const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Globetrotter 🌍" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Verify your Globetrotter account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#6366f1">Welcome to Globetrotter, ${name}! 🌍</h2>
        <p>Click the button below to verify your email address.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
        <p style="color:#888;font-size:12px;margin-top:24px">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
};
