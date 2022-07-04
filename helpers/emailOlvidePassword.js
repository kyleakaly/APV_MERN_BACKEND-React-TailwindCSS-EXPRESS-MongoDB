import nodemailer from 'nodemailer'

const emailOlvidepassword = async (datos) =>{

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email,nombre,token} = datos 
    // enviar el email

    //aqui colocas todos los asuntos quien lo envia etc
    const info = await transporter.sendMail({
 from: 'APV - Administrador de Pacientes',

    to: email,

    subject: 'restablece tu contrasena',
    text: 'restablece tu contrasena',
    html: `<p>hola: ${nombre}, ha solicitado restablecer tu password</p>
    
        <p>sigue el seguiente enlace para restablecer tu contrasena:
        <a href="${process.env.FRONTEND_URL}/OlvidarPassword/${token}">CRestablecer Cuenta </a></p>

        <p>si no mandaste el email de reinicio de contrasena haz caso omiso a este correo</p>

    `

    });

    console.log('mensaje enviado: %s', info.messageId)


}

export default emailOlvidepassword