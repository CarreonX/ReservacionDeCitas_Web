document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-servicio');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            servicio: document.getElementById('servicio').options[document.getElementById('servicio').selectedIndex].text
        };

        try {
            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(result.message || 'Solicitud enviada');
        } catch (err) {
            console.error('Error enviando solicitud:', err);
            alert('Error al enviar la solicitud');
        }
    });
});