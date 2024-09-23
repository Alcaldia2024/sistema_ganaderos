document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe

    // Obtiene los valores del formulario
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Verifica las credenciales
    if (username === 'gamhuacaraje' && password === '1234') {
        // Redirige a la página del sistema de registros
        window.location.href = 'sistema_ganaderos.html';
    } else {
        document.getElementById('error').textContent = 'Usuario o contraseña incorrectos';
    }
});
