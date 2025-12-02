DBConnector = require('../config/db.js');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const port = process.env.PORT || 8080;

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( cors() );

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.route( '/addContacto' ).post( async ( req, res ) => {
    result = await DBConnector.queryWithParams( 'CALL uspAddContacto(?, ?, ?)', 
        [ req.body.nombre, req.body.email, req.body.servicio ] );
    res.json( result );
});

router.route('/login').get((req, res) => {
    res.sendFile(path.join(__dirname, '../public/Html', 'login.html'));
});

app.listen( port);
console.log( 'Server running on port ' + port );

module.exports = router;