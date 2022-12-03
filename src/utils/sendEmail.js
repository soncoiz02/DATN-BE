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
      '1//046N8aywgGYFKCgYIARAAGAQSNwF-L9IrDTYEAGOoHlDuvgD9nVtdG3pwnfkg3NdJGPcLRJ9Gn19k4R4HQtBPWrOAncn15IwoJ30',
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
