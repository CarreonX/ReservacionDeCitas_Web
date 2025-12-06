document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnRegistrar");
  if (btn) btn.addEventListener("click", registrarCita);
});

async function registrarCita() {
  try {
    // obtén valores usando IDs (más fiable)
    const duracion = document.getElementById("duracion").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const fechaCita = document.getElementById("fechaCita").value.trim();
    const hora = document.getElementById("hora").value.trim();
    const idMedico = localStorage.getItem("idmedico"); // coincide con dashboardMedico
    const idPaciente = document.getElementById("idPaciente").value.trim();
    const motivoDeCita = document.getElementById("motivoDeCita").value.trim();
    const nota = document.getElementById("nota").value.trim();

    if (!idMedico) {
      alert("ID del médico no encontrado. Inicie sesión de nuevo.");
      return;
    }

    // Construye el payload
    const payload = {
      duracion,
      estado,
      fechaCita,
      fechaGeneracion: null, // si necesitas, genera en servidor
      hora,
      idMedico,
      idPaciente,
      motivoDeCita,
      nota
    };

    const response = await fetch("/registrarCita", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // Asegúrate de que el servidor responda JSON; por eso cambiamos la ruta server-side
    const data = await response.json();

    if (response.ok && data.success) {
      alert("Cita registrada exitosamente ✔");
      // redirige al dashboard con el id del médico
      window.location.href = `/dashboardMedico/${idMedico}`;
    } else {
      console.error("Registro fallido:", data);
      alert("Error al registrar la cita: " + (data.message || "Revise consola"));
    }

  } catch (error) {
    console.error("Error al registrar la cita:", error);
    alert("Error con el servidor. Ver consola.");
  }
}