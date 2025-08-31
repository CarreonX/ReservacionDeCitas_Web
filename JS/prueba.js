document.addEventListener('DOMContentLoaded', function() {
    const mensaje = document.createElement('p');
    mensaje.innerHTML = "¡prueba.js está funcionando correctamente! <br>";
    let salida = "";
    for( let i = 0; i < 11; i++ ){
        salida += "<br> Imprimiendo el numero: " + i;
    }
    mensaje.innerHTML = mensaje.textContent + salida;
    document.body.appendChild(mensaje);
});