import nodemailer from 'nodemailer'

const emailRegistro = async (datos) =>{

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

    subject: 'comprueba tu cuenta en apv',
    text: 'comprueba tu cuenta en APV',
    html: `<p>hola: ${nombre}, comprueba tu cuenta en APV</p>
    
        <p>Tu cuenta ya esta lista,solo debes comprobarla en el seguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta </a></p>

        <p>si tu no creaste esta cuenta, puedes ignorar este mensaje</p>

    `

    });

    console.log('mensaje enviado: %s', info.messageId)


}

export default emailRegistro