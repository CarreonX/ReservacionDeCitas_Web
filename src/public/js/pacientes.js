document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRegistrarPaciente");
  if (!form) return;
  form.addEventListener("submit", registrarPaciente);
});

async function registrarPaciente(e) {
  e.preventDefault();

  try {
    const idMedico = localStorage.getItem("idmedico");

    if (!idMedico) {
      alert("ID de médico no encontrado. Inicie sesión otra vez.");
      return;
    }

    const datos = {
      apellidoM: document.getElementById("apellidoM").value.trim(),
      apellidoP: document.getElementById("apellidoP").value.trim(),
      direccion: document.getElementById("direccion").value.trim(),
      email: document.getElementById("email").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      telFijo: document.getElementById("telFijo").value.trim(),
      telMovil: document.getElementById("telMovil").value.trim(),
      fechaNacimiento: document.getElementById("fechaNacimiento").value.trim(),
      idRespuestas: document.getElementById("idRespuestas").value.trim(),
      notas: document.getElementById("notas").value.trim(),
      peso: document.getElementById("peso").value.trim(),
      talla: document.getElementById("talla").value.trim(),
      idMedico: idMedico
    };

    const response = await fetch("/registrarPaciente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const resultado = await response.json();

    if (response.ok && resultado.success) {
      alert("Paciente registrado correctamente ✔");
      e.target.reset();
      window.location.href = `/dashboardMedico/${idMedico}`;
    } else {
      alert("Error al registrar paciente: " + (resultado.message || "Desconocido"));
    }

  } catch (error) {
    console.error("Error al registrar paciente:", error);
    alert("Ocurrió un error. Revisa la consola.");
  }
}