import { text } from 'express';
const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'puntoycoma519@gmail.com',
        pass: 'ginwobyvmfdsgvle' // Use an app password for better security
    },
});

export const enviarCorreo = async ( nombre, email, servicio ) => {
    let destino = 'carreonalberto920@gmail.com';
    if( servicio === 'Limpieza Dental Profesional' ) {
        destino = 'abelardogeronimo243@gmail.com';
    }
    if( servicio === 'Ortodoncia y Alineadores' ) {
        destino = 'L22TE0524@teziutlan.tecnm.mx';
    }
    if( servicio === 'Estética Dental' ) {
        destino = 'carreonalberto22te@outlook.com';
    }
    if( servicio === 'Servicio Personalizado' ) {
        destino = 'tijeritas.tekla@gmail.com';
    }

    const mailOptions = {
        from: "puntoycoma519@gmail.com",
        to : destino, 
        subject: `Nuevo cliente interesado en ${servicio}`,
        text: `Nombre: ${nombre}\nEmail: ${email}\nServicio: ${servicio}`
    };
    
    await transporter.sendMail(mailOptions);
}

async function enviarCorreoRegistro({ nombre, email, servicio }) {
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.log('nodemailer no configurado. Datos del registro:', { nombre, email, servicio });
        return;
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });

    const texto = `Nueva solicitud de servicio\n\nNombre: ${nombre}\nEmail: ${email}\nServicio: ${servicio}\nFecha: ${new Date().toISOString()}`;

    await transporter.sendMail({
        from: SMTP_USER,
        to: ADMIN_EMAIL,
        subject: 'Nueva solicitud de servicio',
        text: texto,
        replyTo: email || undefined
    });
}

module.exports = { enviarCorreoRegistro };