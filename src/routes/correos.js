const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'puntoycoma519@gmail.com',
        pass: 'ginwobyvmfdsgvle'
    },
});

function obtenerNumeroServicio(textoServicio) {
    const servicios = {
        1: 'Limpieza Dental Profesional',
        2: 'Ortodoncia y Alineadores',
        3: 'Estética Dental',
        4: 'Servicio Personalizado'
    };
    return servicios[textoServicio] !== undefined ? servicios[textoServicio] : 4;
}

function enviarCorreo(nombre, email, servicio) {
    let destino = 'carreonalberto920@gmail.com'; // default
    
    // Mapear servicios a destinatarios
    const destinatarios = {
        1: 'abelardogeronimo243@gmail.com',
        2: 'L22TE0524@teziutlan.tecnm.mx',
        3: 'carreonalberto22te@outlook.com',
        4: 'tijeritas.tekla@gmail.com'
    };
    
    destino = destinatarios[servicio] || destino;

    const mailOptions = {
        from: "puntoycoma519@gmail.com",
        to: destino, 
        subject: `🦷 Nuevo cliente interesado en ${servicio}`,
        text: `Nueva solicitud de servicio dental:\n\nNombre: ${nombre}\nEmail: ${email}\nServicio solicitado: ${servicio}\n\nFecha: ${new Date().toLocaleString()}`
    };
    
    console.log(`📧 Enviando correo a: ${destino}`);
    return transporter.sendMail(mailOptions);
}

// Alias para mantener compatibilidad
function enviarCorreoRegistro(datos) {
    return enviarCorreo(datos.nombre, datos.email, obtenerNumeroServicio( datos.servicio ));
}

module.exports = { 
    enviarCorreo, 
    enviarCorreoRegistro
};