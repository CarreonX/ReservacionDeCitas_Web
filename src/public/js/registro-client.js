async function agregarContacto() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const servicio = document.getElementById('servicio').value;

    if( !nombre || !email || !servicio ) {
        mostrarMensajeAgregar('Por favor, completa todos los campos.', 'error');
        return;
    }

    try{
        let response= await fetch('http://localhost:8080/addContacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                servicio: servicio
            })
        });

        let data = await response.json();
        console.log('Respuesta del servidor:', data);

        if(response.ok){
            alert('Contacto agregado correctamente.', 'success');
            limpiarFormularioAgregar();
        } else {
            mostrarMensajeAgregar('Error al agregar contacto:', 'error');
        }
    }catch(error){
        console.error('Error en la solicitud:', error);
        mostrarMensajeAgregar('Error en la solicitud al servidor.', 'error');
    }
}


function mostrarMensajeAgregar(mensaje, tipo) {
    const div = document.getElementById("mensajeResultadoAgregar");
    div.textContent = mensaje;
    div.className = 'alert alert-' + (tipo === 'success' ? 'success' : 'error');
    div.classList.remove('display-none');
}

function limpiarFormularioAgregar() {
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
}