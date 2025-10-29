const {Router} = require( 'express');
const axios = require('axios');

const app = Router();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../index.html');
})