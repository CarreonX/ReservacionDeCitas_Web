document.addEventListener("DOMContentLoaded", async () => {

    // 1. Obtener id_medico desde la URL
    //const params = new URLSearchParams(window.location.search);
    const id_medico = localStorage.getItem("id_medico");

    if (!id_medico) {
        console.error("❌ No se recibió id_medico en la URL");
        return;
    }

    console.log("📌 ID Médico recibido:", id_medico);

    try {
        // 2. Hacer petición al backend para obtener los datos del médico
        const response = await fetch(`/medico/${id_medico}`);
        const data = await response.json();

        if (!data.success) {
            console.error("❌ Error al obtener datos del médico");
            return;
        }

        const medico = data.medico;

        // 3. Insertar la información en el HTML
        //    *Esto lo adaptarás después a tus IDs reales*
        document.getElementById("nombre").textContent = medico.nombre;
        document.getElementById("apellidoM").textContent = medico.apellidoM;
        document.getElementById("apellidoP").textContent = medico.apellidoP;
        document.getElementById("email").textContent = medico.email;
        document.getElementById("nombreMedicoNav").textContent = `Bienvenido ${medico.nombre}`;


        console.log("✔ Datos insertados correctamente");

    } catch (error) {
        console.error("Error al obtener información del médico:", error);
    }
});