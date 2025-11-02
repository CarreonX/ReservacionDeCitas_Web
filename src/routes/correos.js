import { text } from 'express';
import nodemailer from 'nodemailer';

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