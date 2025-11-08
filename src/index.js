const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('case sensitive routing', true);
app.set('appName', 'Reservacion de citas');
app.set('port', 8080); // ✅ CAMBIO: 3000 → 8080
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONECTA LAS RUTAS
const registroRoutes = require('./routes/registro');
const homeRoutes = require('./routes/home');

app.use('/', homeRoutes);
app.use('/api', registroRoutes);

// ✅ CAMBIO: Escuchar en todas las interfaces con puerto 8080
app.listen(8080, '0.0.0.0', () => {
    console.log(`🚀 Server ${app.get('appName')} on port ${app.get('port')}`);
    console.log(`📍 Accesible desde:`);
    console.log(`   http://localhost:8080`);
    console.log(`   http://192.168.1.253:8080`);
    console.log(`📧 Ruta de registro: http://192.168.1.253:8080/api/registro`);
});