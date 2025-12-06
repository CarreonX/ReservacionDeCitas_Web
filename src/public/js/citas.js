async function registrarCita(){
    const duracion = document.getElementsByName("duracion")[0].value.trim();
    const estado = document.getElementsByName("estado")[0].value.trim();
    const fechaCita = document.getElementsByName("fechaCita")[0].value.trim();
    const hora = document.getElementsByName("hora")[0].value.trim();
    const idMedico = localStorage.getItem("idmedico");
    const idPaciente = document.getElementsByName("idPaciente")[0].value.trim();
    const motivoDeCita = document.getElementsByName("motivoDeCita")[0].value.trim();
    const nota = document.getElementsByName("nota")[0].value.trim();

    try{
        const response = await fetch("/registrarCita", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                duracion,
                estado,
                fechaCita,
                fechaGeneracion: null,
                hora,
                idMedico,
                idPaciente,
                motivoDeCita,
                nota
            })
        });
        const data = await res.json();

        if (data.success) {
            alert("Cita registrada exitosamente ✔");
            window.location.href = `/dashboardMedico/${idMedico}`;
        } else {
            alert("Error al registrar la cita ❌");
        }

    } catch (error) {
        console.error("Error al registrar la cita:", error);
        alert("Error con el servidor");
    }
}