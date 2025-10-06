import { obtenerFichas } from "./fichaAdso.js";

const selectfichas = document.querySelector("#selector-ficha");
const selectAprendices = document.querySelector("#selector-aprendiz");

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

// Función para verificar sesión y configurar la interfaz
function inicializarSesion() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre de usuario
    document.getElementById('userLogin').textContent = username;
    showToast("Bienvenido de nuevo, " + username);
    
    // Configurar botón de salir
    const btnSalir = document.getElementById('btn-salir');
    if (btnSalir) {
        btnSalir.addEventListener('click', () => {
            if(confirm('¿Está seguro que desea cerrar sesión?')) {
                showToast("¡Hasta pronto, " + username + "!");
                setTimeout(() => {
                    localStorage.removeItem('username');
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarSesion);

async function cargarFichas() {
    const fichas = await obtenerFichas();
    selectfichas.innerHTML = '<option value="">Seleccione una ficha</option>';
    
    fichas.forEach(ficha => {
        const option = document.createElement('option');
        option.value = ficha.url;
        option.textContent = ficha.codigo;
        selectfichas.appendChild(option);
    });
}

selectfichas.addEventListener('change', async () => {
    const urlFicha = selectfichas.value;
    
    // Limpiar selector de aprendices
    selectAprendices.innerHTML = '<option value="">Seleccione un aprendiz</option>';
    
    // Habilitar/deshabilitar según si hay ficha seleccionada
    selectAprendices.disabled = !urlFicha;
    
    if(!urlFicha) {
        // Limpiar campos si no hay ficha seleccionada
        document.querySelector("#nombre-programa").textContent = '';
        document.querySelector("#estado-aprendiz").textContent = '';
        return;
    }

    try {
        const response = await fetch(urlFicha);
        const aprendices = await response.json();
        
        console.log('Datos recibidos de la ficha:', aprendices); // Debug
        
        // Mostrar datos del programa (tomamos del primer aprendiz)
        if(aprendices && aprendices.length > 0) {
            document.querySelector("#nombre-programa").textContent = aprendices[0].PROGRAMA || '';
            
            // Filtrar documentos únicos y ordenarlos
            const documentosUnicos = [...new Map(aprendices.map(item =>
                [item["Número de Documento"], item])).values()];
            
            // Cargar aprendices únicos en el selector
            documentosUnicos.forEach(aprendiz => {
                const option = document.createElement('option');
                option.value = JSON.stringify(aprendiz);
                option.textContent = aprendiz["Número de Documento"];
                selectAprendices.appendChild(option);
            });
            
            showToast("Ficha cargada correctamente");
        }
    } catch(error) {
        console.error("Error al cargar datos de la ficha:", error);
        showToast("Error al cargar los datos de la ficha", true);
    }
});

selectAprendices.addEventListener('change', async () => {
    const aprendizSeleccionado = selectAprendices.value ? JSON.parse(selectAprendices.value) : null;
    
    if(aprendizSeleccionado) {
        // Actualizar datos básicos del aprendiz
        document.querySelector("#nombres-aprendiz").textContent = aprendizSeleccionado.Nombre || '';
        document.querySelector("#apellidos-aprendiz").textContent = aprendizSeleccionado.Apellidos || '';
        document.querySelector("#estado-aprendiz").textContent = aprendizSeleccionado.Estado || '';

        try {
            // Obtener todos los resultados del aprendiz
            const response = await fetch(selectfichas.value);
            const data = await response.json();
            
            // Filtrar todos los registros del aprendiz
            const resultadosAprendiz = data.filter(registro => 
                registro["Número de Documento"] === aprendizSeleccionado["Número de Documento"]
            );

            // Contar juicios
            const juiciosEvaluados = resultadosAprendiz.filter(r => r["Juicio de Evaluación"] !== "POR EVALUAR").length;
            const juiciosPorEvaluar = resultadosAprendiz.filter(r => r["Juicio de Evaluación"] === "POR EVALUAR").length;

            document.querySelector("#juicios-evaluados").textContent = juiciosEvaluados;
            document.querySelector("#juicios-por-evaluar").textContent = juiciosPorEvaluar;

            // Llenar tabla
            const tbody = document.querySelector("#tbody-juicios");
            tbody.innerHTML = '';

            resultadosAprendiz.forEach(resultado => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${resultado.Competencia}</td>
                    <td>${resultado["Resultado de Aprendizaje"]}</td>
                    <td style="color: ${resultado["Juicio de Evaluación"] === 'POR EVALUAR' ? 'red' : 'green'}">
                        ${resultado["Juicio de Evaluación"]}
                    </td>
                    <td>${resultado["Funcionario que registro el juicio evaluativo"]?.trim() || 'No asignado'}</td>
                `;
                tbody.appendChild(tr);
            });
            
            showToast(`Aprendiz ${aprendizSeleccionado.Nombre} cargado correctamente`);
        } catch(error) {
            console.error("Error al cargar resultados:", error);
        }
    } else {
        // Limpiar campos
        document.querySelector("#nombres-aprendiz").textContent = '';
        document.querySelector("#apellidos-aprendiz").textContent = '';
        document.querySelector("#estado-aprendiz").textContent = '';
        document.querySelector("#juicios-evaluados").textContent = '0';
        document.querySelector("#juicios-por-evaluar").textContent = '0';
        document.querySelector("#tbody-juicios").innerHTML = '';
    }
});

cargarFichas();