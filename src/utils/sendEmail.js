import sgMail from '@sendgrid/mail';

// Configuración por defecto de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY');

export const sendVerificationEmail = async (to, token) => {
  try {
    const url = `${process.env.HOST}:${process.env.PORT}/usuario/verify/${token}`;

    const msg = {
      to,
      from: 'no-reply@tudominio.com',
      subject: 'Verifica tu cuenta',
      html: `
        <h2>Verifica tu correo electrónico</h2>
        <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
        <a href="${url}">${url}</a>
      `
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
};
