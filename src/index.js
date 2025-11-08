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
app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONECTA LAS RUTAS
const registroRoutes = require('./routes/registro');
const homeRoutes = require('./routes/home');

app.use('/', homeRoutes);
app.use('/api', registroRoutes); // Todas las APIs bajo /api

app.listen(3000, () => {
    console.log(`🚀 Server ${app.get('appName')} on port ${app.get('port')}`);
    console.log(`📧 Ruta de registro: http://localhost:3000/api/registro`);
});