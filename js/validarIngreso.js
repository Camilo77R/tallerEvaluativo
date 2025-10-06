// Verificar si ya hay una sesión activa
function verificarSesion() {
    const username = localStorage.getItem('username');
    if (username) {
        Toastify({
            text: "Ya has iniciado sesión como " + username,
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#22c55e",
            className: "rounded-lg",
            stopOnFocus: true,
        }).showToast();
        
        setTimeout(() => {
            window.location.href = 'juiciosAprendicesFicha.html';
        }, 1000);
    }
}

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', verificarSesion);

const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('error');

function showToast(message, isError = false) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: isError ? "#ef4444" : "#22c55e",
        className: "rounded-lg",
        stopOnFocus: true,
    }).showToast();
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value;

    if (username === '') {
        showToast("Por favor ingrese un nombre de usuario", true);
        return;
    }

    if(password === '06102025') {
        showToast("¡Bienvenido " + username + "! Iniciando sesión...");
        localStorage.setItem('username', username);
        setTimeout(() => {
            window.location.href = 'juiciosAprendicesFicha.html';
        }, 1000);
    } else {
        showToast("Contraseña incorrecta. Intente de nuevo.", true);
        errorMsg.textContent = '';
    }
});


