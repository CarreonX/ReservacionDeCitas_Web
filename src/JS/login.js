async function ingresar() {
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        alert("Por favor ingresa usuario y contraseña");
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        if (data.success) {
            alert("Ingreso exitoso ✔");

            // Redirigir a panel del médico
            window.location.href = "/dashboardMedico"; 
        } else {
            alert("Credenciales incorrectas ❌");
        }

    } catch (error) {
        console.error("Error en login:", error);
        alert("Error con el servidor");
    }
}