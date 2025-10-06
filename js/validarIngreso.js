const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('error');

form.addEventListener('submit', function(event) {//este event submit es para que al dar click en el boton de ingresar se ejecute la funcion
    event.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value;

    if(password === '06102025') {
        localStorage.setItem('username', username);//aqui guarda el nombre de usuario en el almacenamiento local
        window.location.href = 'juiciosAprendicesFicha.html'; //aqui redirige a la pagina principal
    } else {
        errorMsg.textContent = 'Contraseña incorrecta. Intente de nuevo.';
    }
});


