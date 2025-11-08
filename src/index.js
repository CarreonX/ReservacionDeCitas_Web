const express = require('express');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
require('ejs');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('case sensitive routing', true);
app.set('appName', 'Reservacion de citas');
app.set('port', 443 );
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;
    try {
        const saved = await registro.guardarRegistro({ nombre, email, servicio });
        await correos.enviarCorreoRegistro({ nombre, email, servicio });
        res.json({ mensaje: `Solicitud recibida. Gracias, ${saved.nombre || 'usuario'}.`, registro: saved });
    } catch (err) {
        console.error('Error procesando /registro:', err);
        res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
});

app.listen(3000);
console.log(`Server ${app.get('appName')} on port ${app.get('port')}`)