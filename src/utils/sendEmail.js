import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'beautyparadise1102@gmail.com',
    pass: 'soncoiz02',
    clientId:
      '703579968493-uticdlqnqmbm6p2q8lg4r4f86987qlec.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken:
      '1//04wz-AmdUcc3kCgYIARAAGAQSNwF-L9Ir01sPn5R9K9KlNCqVY2CPD-XJ2WlyL7Z9nAPqkyISjWQuMM5Kci_xu8sRbprwhtHVokA',
  },
});

const sendEmail = (emailOption) => {
  transporter.sendMail(emailOption, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

export default sendEmail;
