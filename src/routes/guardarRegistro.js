const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REGISTROS_FILE = path.join(DATA_DIR, 'registros.json');

async function ensureDataFile() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        try {
            await fs.access(REGISTROS_FILE);
        } catch {
            await fs.writeFile(REGISTROS_FILE, '[]', 'utf8');
            console.log('📁 Archivo de registros creado:', REGISTROS_FILE);
        }
    } catch (err) {
        console.error('❌ Error creando archivo de datos:', err);
        throw err;
    }
}

async function guardarRegistro({ nombre, email, servicio }) {
    await ensureDataFile();
    
    try {
        const raw = await fs.readFile(REGISTROS_FILE, 'utf8');
        const registros = JSON.parse(raw || '[]');
        
        const nuevoRegistro = {
            id: Date.now(),
            nombre: nombre || 'No proporcionado',
            email: email || 'No proporcionado',
            servicio: servicio || 'No especificado',
            fecha: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        registros.push(nuevoRegistro);
        await fs.writeFile(REGISTROS_FILE, JSON.stringify(registros, null, 2), 'utf8');
        
        console.log('💾 Registro guardado en archivo:', nuevoRegistro);
        return nuevoRegistro;
    } catch (err) {
        console.error('❌ Error guardando registro en archivo:', err);
        throw err;
    }
}

module.exports = { guardarRegistro };