const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // або інший сервіс
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendNotification = async (email, status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Рішення щодо вашої пропозиції',
    text: `Ваш офер було розглянуто модератором. Статус: ${status}.`,
  };
  return transporter.sendMail(mailOptions);
};
