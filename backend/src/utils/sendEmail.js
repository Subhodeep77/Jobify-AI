import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  logger: true,
  debug: true,
});

const sendEmail = async ({ to, subject, text }) => {
  console.log("SMTP: verifying...");
  await transporter.verify();
  console.log("SMTP: verified");

  console.log("SMTP: sending...");
  const info = await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log("SMTP: sent", info.messageId);
};

export default sendEmail;