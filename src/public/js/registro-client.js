document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formulario-servicio');
    const boton = document.getElementById('btn-solicitar');
    const textoBoton = document.getElementById('btn-text');

    // Validación de seguridad por si el script carga en una página sin formulario
    if (!formulario) return;

    formulario.addEventListener('submit', async function (event) {
        // 1. Evitar el recargo de la página
        event.preventDefault();

        // 2. Obtener datos
        const selectServicio = document.getElementById('servicio');
        // Obtenemos el texto (ej: "Ortodoncia") en lugar del value numérico, 
        // ya que tu backend maneja la conversión si es necesario.
        const textoServicio = selectServicio.options[selectServicio.selectedIndex].text;

        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            servicio: textoServicio
        };

        // 3. Validación básica en cliente
        if (!datos.nombre || !datos.email) {
            alert('⚠️ Por favor completa todos los campos obligatorios.');
            return;
        }

        // 4. Feedback visual: Deshabilitar botón
        boton.disabled = true;
        if(textoBoton) textoBoton.textContent = 'Enviando...';

        try {
            console.log('📤 Enviando datos a /api/registro:', datos);

            // 5. Petición al Backend
            // NOTA: Usamos /api/registro porque en index.js definiste app.use('/api', registroRoutes)
            const respuesta = await fetch('/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            // Verificar que la respuesta sea un JSON válido
            const contentType = respuesta.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Respuesta inesperada del servidor (no es JSON).");
            }

            const resultado = await respuesta.json();
            console.log('📥 Respuesta del servidor:', resultado);

            // 6. Manejo de la respuesta
            if (resultado.success) {
                alert('✅ ' + resultado.message);
                formulario.reset(); // Limpiar el formulario tras éxito
            } else {
                alert('⚠️ ' + resultado.message); // Error de negocio (ej. usuario duplicado)
            }

        } catch (error) {
            console.error('❌ Error de conexión:', error);
            alert('❌ Error al conectar con el servidor.\n\nAsegúrate de que el backend esté corriendo en el puerto 8080.');
        } finally {
            // 7. Restaurar botón
            boton.disabled = false;
            if(textoBoton) textoBoton.textContent = 'Solicita tu servicio';
        }
    });
});

// Función de compatibilidad (por si dejaste el onclick en el HTML)
// Aunque lo ideal es borrar el atributo onclick="agregarContacto()" de tu HTML.
function agregarContacto() {
    const form = document.getElementById('formulario-servicio');
    if (form) {
        // Dispara el evento submit manualmente para que lo capture el listener de arriba
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
}