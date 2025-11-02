const express = require('express');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
require('ejs');

const app = express();

app.set('case sensitive routing', true);
app.set('appName', 'Reservacion de citas');
app.set('port', 3000 );
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000);
console.log(`Server ${app.get('appName')} on port ${app.get('port')}`)