document.getElementById("index.html").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    const data = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        servicio: document.getElementById("servicio").value
    };

    const response = await fetch("/routes/registro.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.mensaje);
});