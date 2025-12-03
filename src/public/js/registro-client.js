document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-servicio');
    const btn = document.getElementById('btn-solicitar');

    // Comprueba si el servidor responde correctamente (usa ruta RELATIVA)
    async function probarServidor() {
        try {
            const res = await fetch('/api/test', { method: 'GET' });
            if (!res.ok) {
                console.warn('probarServidor: respuesta no OK', res.status);
                return false;
            }
            // parsear solo si es JSON
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                console.warn('probarServidor: content-type no es JSON:', contentType);
                return false;
            }
            await res.json();
            return true;
        } catch (err) {
            console.error('probarServidor: error:', err);
            return false;
        }
    }

    async function enviarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const servicio = document.getElementById('servicio').value;

        if (!nombre || !email) {
            alert('Completa nombre y email.');
            return;
        }

        // Primero verificar servidor
        const ok = await probarServidor();
        if (!ok) {
            alert('El servidor no está disponible. Verifica que esté corriendo.');
            return;
        }

        try {
            console.log('📤 Enviando datos a /addContacto:', { nombre, email, servicio });

            const res = await fetch('/addContacto', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ nombre, email, servicio })
             });

             if (!res.ok) {
                 const text = await res.text().catch(() => null);
                 throw new Error(text || `Error ${res.status}`);
             }

             // revisar content-type antes de parsear
             const ct = res.headers.get('content-type') || '';
             let data = {};
             if (ct.includes('application/json')) {
                 data = await res.json().catch(() => ({}));
             } else {
                 data = { message: await res.text().catch(() => 'OK') };
             }

             alert(data.message || data.mensaje || 'Solicitud enviada correctamente.');
             form.reset();
         } catch (err) {
            console.error('Error al enviar /addContacto:', err);
            alert('Error al enviar la solicitud. Verifica la consola del servidor.');
         }
     }

     btn.addEventListener('click', (e) => {
         e.preventDefault();
         enviarFormulario();
     });

     form.addEventListener('submit', (e) => {
         e.preventDefault();
         enviarFormulario();
     });
});