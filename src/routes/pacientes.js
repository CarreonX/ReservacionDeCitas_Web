const pool = require( '../config/db');
/*
async function getPacientes(){
    let connection;
    try{
        //Obtener la conexion del pool
        connection = await pool.getConnection();

        //Ejecutar el procedimiento almacenado
        const [rows] = await connection.query( 'CALL uspGetPacientes()' );

        //Retornar los resultados en formato JSON
        return rows;
    }
    catch( error ){
        throw new Error(`Error al obtener pacientes: ', ${error.message}`);
    }
    finally{
        if( connection ) connection.release();
    }
}*/

async function createPatient(patientData) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [rows] = await connection.query(
            'CALL uspCreatePaciente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                patientData.apellidoM,
                patientData.apellidoP,
                patientData.direccion,
                patientData.email,
                patientData.nombre,
                patientData.telefonoFijo,
                patientData.telefonoMovil,
                patientData.fechaNacimiento,
                patientData.idRespuestasClinicas,
                patientData.notas,
                patientData.peso,
                patientData.talla,
                patientData.idMedico
            ]
        );
        
        return rows[0][0].nuevo_id;
    } catch (error) {
        throw new Error(`Error al crear paciente: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}

async function getReadPaciente(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [rows] = await connection.query(
            'CALL uspReadPaciente(?)',
            [id]
        );
        
        return rows[0][0];
    } catch (error) {
        throw new Error(`Error al obtener paciente: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}

async function getAllPatients() {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [rows] = await connection.query('CALL uspReadAllPacientes()');
        
        return rows[0];
    } catch (error) {
        throw new Error(`Error al obtener pacientes: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}

async function updatePatient(id, patientData) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [rows] = await connection.query(
            'CALL uspUpdatePaciente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                patientData.apellidoM,
                patientData.apellidoP,
                patientData.direccion,
                patientData.email,
                patientData.nombre,
                patientData.telefonoFijo,
                patientData.telefonoMovil,
                patientData.fechaNacimiento,
                patientData.idRespuestasClinicas,
                patientData.notas,
                patientData.peso,
                patientData.talla,
                patientData.idMedico
            ]
        );
        
        return rows[0][0].filas_afectadas;
    } catch (error) {
        throw new Error(`Error al actualizar paciente: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}

async function deletePatient(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [rows] = await connection.query(
            'CALL uspDeletePaciente(?)',
            [id]
        );
        
        return rows[0][0].filas_afectadas;
    } catch (error) {
        throw new Error(`Error al eliminar paciente: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}

async function getPatientsByDoctor(idMedico) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [rows] = await connection.query(
            'CALL uspReadPacientesPorMedico(?)',
            [idMedico]
        );
        
        return rows[0];
    } catch (error) {
        throw new Error(`Error al obtener pacientes por médico: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    createPatient,
    getReadPaciente,
    getAllPatients,
    updatePatient,
    deletePatient,
    getPatientsByDoctor
};