document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formulario-servicio');
    const boton = document.getElementById('btn-solicitar');
    const textoBoton = document.getElementById('btn-text');

    formulario.addEventListener('submit', async function (event) {
        event.preventDefault();

        const selectServicio = document.getElementById('servicio');
        const textoServicio = selectServicio.options[selectServicio.selectedIndex].text;

        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            servicio: textoServicio
        };

        if (!datos.nombre || !datos.email) {
            alert('⚠️ Por favor completa todos los campos obligatorios.');
            return;
        }

        boton.disabled = true;
        textoBoton.textContent = 'Enviando...';

        try {
            console.log('📤 Enviando datos:', datos);

            const respuesta = await fetch('/routes/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            const resultado = await respuesta.json();
            console.log('📥 Respuesta del servidor:', resultado);

            if (resultado.success) {
                alert('✅ ' + resultado.message);
                formulario.reset();
            } else {
                alert('❌ ' + resultado.message);
            }
        } catch (error) {
            console.error('❌ Error completo:', error);
            alert('❌ Error de conexión: ' + error.message + '\n\nVerifica que el servidor esté corriendo y las rutas disponibles.');
        } finally {
            boton.disabled = false;
            textoBoton.textContent = 'Solicita tu servicio';
        }
    });
});

// Para compatibilidad, exponer una función mínima si algún HTML la llama
function agregarContacto() {
    const form = document.getElementById('formulario-servicio');
    if (form) form.requestSubmit();
}
