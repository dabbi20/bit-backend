import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to, token) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `${process.env.HOST}:${process.env.PORT}/usuario/verify/${token}`;

  const mailOptions = {
    from: `"Tu App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verifica tu cuenta",
    html: `<h2>Verifica tu correo electrónico</h2>
           <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
           <a href="${url}">${url}</a>`,
  };

  await transport.sendMail(mailOptions);
};
