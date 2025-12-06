const express = require('express');
const morgan = require('morgan'); 
const path = require('path');
const cors = require('cors'); // ✅ AGREGAR ESTO

const app = express();

//Configuracion de plantillas EJS
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    if (req.hostname === 'www.carreon.com' || req.hostname === 'carreon.com') {
        return res.redirect(301, `http://localhost:8080${req.url}`);
    }
    next();
});

app.use((req, res, next) => {
    res.locals.idMedico = req.params?.id_medico || null;
    next();
});

// ✅ MIDDLEWARE CORS - AGREGAR ESTO
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8080'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('case sensitive routing', true);
app.set('appName', 'Reservacion de citas');
app.set('port', 8080);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONECTA LAS RUTAS
const homeRoutes = require('./routes/home.js');

app.use('/', homeRoutes);

// ✅ RUTA DE PRUEBA - AGREGAR ESTO
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ Servidor Express funcionando', 
        timestamp: new Date().toISOString() 
    });
});

app.use('/JS', express.static(path.join(__dirname, 'JS')));



app.listen(8080, '0.0.0.0', () => {
    console.log(`🚀 Server ${app.get('appName')} on port ${app.get('port')}`);
    console.log(`📍 Accesible desde: http://localhost:8080`);
    console.log(`📧 Ruta de registro: http://localhost:8080/api/registro`);
    console.log(`🧪 Ruta de prueba: http://localhost:8080/api/test`);
});