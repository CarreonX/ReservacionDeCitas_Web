import express from 'express';
import {pool} from '../config/db.js';
import { enviarCorreo } from './correos';

const router = express.Router();

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;

    try {
        const [rows] = await pool.query( 'call uspAddContacto(?, ?, ?)', 
            [ nombre, email, servicio ] );

        const resultado = rows[0][0].resultado;

        if (resultado === 1) {
            await enviarCorreo( nombre, email, servicio );
            res.status(200).json({success: true, message: 'Contacto registrado y correo enviado'});
        } else {
                res.status(409).json({success: false, message: 'El contacto ya existe'});
        }
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({success: false, message: 'Error en el servidor', error: error.message});
    }
});

export default router;
