const {Router} = require( 'express');
const axios = require('axios');

const app = Router();

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
})

app.post('/contact', async (req, res) => {
    const { nombre, email, servicio } = req.body;
    try {
        await axios.post('http://localhost:3000/api/correos/enviar', {
            nombre,
            email,
            servicio
        });
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }   
});
