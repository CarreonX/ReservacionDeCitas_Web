document.addEventListener("DOMContentLoaded", () => {

    const url = new URL(window.location.href);
    const idMedico = url.searchParams.get("idMedico");

    if (!idMedico) {
        alert("No se recibió el ID del médico");
        return;
    }

    const form = document.getElementById("formRegistrarPaciente");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            apellidoM: document.getElementById("apellidoM").value,
            apellidoP: document.getElementById("apellidoP").value,
            direccion: document.getElementById("direccion").value,
            email: document.getElementById("email").value,
            nombre: document.getElementById("nombre").value,
            telFijo: document.getElementById("telFijo").value,
            telMovil: document.getElementById("telMovil").value,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            idRespuestas: document.getElementById("idRespuestas").value,
            notas: document.getElementById("notas").value,
            peso: document.getElementById("peso").value,
            talla: document.getElementById("talla").value,
            idMedico: idMedico
        };

        try {
            const response = await fetch("/registrarPaciente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                alert("Paciente registrado correctamente");
                form.reset();
            } else {
                alert("Error: " + resultado.message);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al registrar el paciente");
        }
    });

});