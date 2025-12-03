document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-servicio');
    const btn = document.getElementById('btn-solicitar');

    async function enviarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const servicio = document.getElementById('servicio').value;

        if (!nombre || !email) {
            alert('Completa nombre y email.');
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

             const data = await res.json().catch(() => ({}));
             alert(data.message || data.mensaje || 'Solicitud enviada correctamente.');
             form.reset();
         } catch (err) {
            console.error('Error al enviar /addContacto:', err);
             alert('El servidor no está disponible. Verifica que esté corriendo.');
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