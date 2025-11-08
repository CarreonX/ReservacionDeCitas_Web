import express from 'express';
import {pool} from '../config/db.js';
import { enviarCorreo } from './correos';
import { guardarRegistro } from './ruta/al/modulo/guardarRegistro'; // Asegúrate de poner la ruta correcta

const router = express.Router();

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;

    try {
        const [rows] = await pool.query( 'call uspAddContacto(?, ?, ?)', 
            [ nombre, email, servicio ] );

        const resultado = rows[0][0].resultado;

        if (resultado === 1) {
            await enviarCorreo( nombre, email, servicio );
            await guardarRegistro({ nombre, email, servicio }); // Guardar registro en el archivo
            res.status(200).json({success: true, message: 'Contacto registrado y correo enviado'});
        } else {
                res.status(409).json({success: false, message: 'El contacto ya existe'});
        }
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({success: false, message: 'Error en el servidor', error: error.message});
    }
});

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'registros.json');

async function ensureDataFile() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        try {
            await fs.access(FILE);
        } catch {
            await fs.writeFile(FILE, '[]', 'utf8');
        }
    } catch (err) {
        throw err;
    }
}

async function guardarRegistro({ nombre, email, servicio }) {
    await ensureDataFile();
    const raw = await fs.readFile(FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    const nuevo = {
        id: Date.now(),
        nombre: nombre || null,
        email: email || null,
        servicio: servicio || null,
        fecha: new Date().toISOString()
    };
    arr.push(nuevo);
    await fs.writeFile(FILE, JSON.stringify(arr, null, 2), 'utf8');
    return nuevo;
}

module.exports = { guardarRegistro };

export default router;
