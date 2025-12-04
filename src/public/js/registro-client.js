async function agregarContacto() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const servicio = parseInt( document.getElementById('servicio').value );

    if( !nombre || !email || !servicio ) {
        mostrarMensajeAgregar('Por favor, completa todos los campos.', 'error');
        return;
    }

    try{
        console.log('📤 Enviando datos a /registro:', { nombre, email, servicio });
        
        let response = await fetch('/addContacto', {
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
        console.log('📥 Respuesta del servidor:', data);

        if(response.ok && data.success){
            mostrarMensajeAgregar(data.message || 'Su información ha sido guardada. Nos comunicaremos lo mas pronto con usted!', 'success');
            limpiarFormularioAgregar();
            // Opcional: redirigir después de 2 segundos
            // setTimeout(() => { window.location.href = '/'; }, 2000);
        } else {
            mostrarMensajeAgregar(data.message || 'Error al agregar contacto.', 'error');
        }
    }catch(error){
        console.error('❌ Error en la solicitud:', error);
        mostrarMensajeAgregar('Error en la solicitud al servidor. Verifica la consola.', 'error');
    }
}

function mostrarMensajeAgregar(mensaje, tipo) {
    const div = document.getElementById("mensajeResultadoAgregar");
    if (!div) {
        console.warn('⚠️ Elemento #mensajeResultadoAgregar no encontrado. Mostrando alert.');
        alert(mensaje);
        return;
    }
    div.textContent = mensaje;
    div.className = 'alert alert-' + (tipo === 'success' ? 'success' : 'error');
    div.classList.remove('display-none');
}

function limpiarFormularioAgregar() {
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('servicio').value = '';
}