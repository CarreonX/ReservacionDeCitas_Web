const DBConnector = require('../config/db.js');
const express = require('express');
const path = require('path');
const router = express.Router();

const port = process.env.PORT || 8080;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.route( '/addContacto' ).post( async ( req, res ) => {
    try {
        const result = await DBConnector.queryWithParams( 'CALL uspAddContacto(?, ?, ?)', 
            [ req.body.nombre, req.body.email, req.body.servicio ] );
        res.json({ success: true, message: 'Contacto agregado correctamente.', data: result });
    } catch (err) {
        console.error('Error en /addContacto:', err);
        res.status(500).json({ success: false, message: 'Error al agregar contacto.' });
    }
});

router.route('/login').get((req, res) => {
    res.sendFile(path.join(__dirname, '../public/Html', 'login.html'));
});

module.exports = router;