async function registrarCita(){
    const duracion = document.getElementsByName("duracion").value.trim();
    const estado = document.getElementsByName("estado").value.trim();
    const fechaCita = document.getElementsByName("fechaCita").value.trim();
    const fechaGeneracion = document.getElementsByName("fechaGeneracion").value.trim();
    const hora = document.getElementsByName("hora").value.trim();
    const idMedico = localStorage.getItem("idmedico").value.trim();
    const idPaciente = document.getElementsByName("idPaciente").value.trim();
    const motivoDeCita = document.getElementsByName("motivoDeCita").value.trim();
    const nota = document.getElementsByName("nota").value.trim();

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
                fechaGeneracion,
                hora,
                idMedico,
                idPaciente,
                motivoDeCita,
                nota
            })
        })
        .then( res => res.json() )
        .then( data => {
            if (data.success) {
                alert("Cita registrada exitosamente ✔");
                window.location.href = `/dashboardMedico/${idMedico}`;
            }
            else {
                alert("Error al registrar la cita ❌");
            }
        });
        
    } catch (error) {
        console.error("Error al registrar la cita:", error);
        alert("Error con el servidor");
    }
}