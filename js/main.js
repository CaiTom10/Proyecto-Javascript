// --- Modelo de pregunta ---
function Pregunta(texto, respuestaCorrecta) {
    this.texto = texto;
    this.respuestaCorrecta = respuestaCorrecta;
}

// --- Cargar preguntas desde JSON ---
let preguntas = [];
let preguntasCargadas = false;

fetch('js/preguntas.json')
    .then(response => response.json())
    .then(data => {
    preguntas = data.map(p => new Pregunta(p.texto, p.respuestaCorrecta));
    preguntasCargadas = true;
    })
    .catch(() => {
    Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las preguntas.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
});

// --- Variables de estado ---
let puntaje = 0;
let indice = 0;
let timerInterval;
const TIEMPO_POR_PREGUNTA = 15;
let tiempoRestante = TIEMPO_POR_PREGUNTA;

// --- Elementos del DOM ---
const pantallaInicio = document.getElementById("pantalla-inicio");
const btnIniciar = document.getElementById("btnIniciar");
const mainCard = document.getElementById("main-card");
const preguntaDiv = document.getElementById("pregunta");
const respuestaInput = document.getElementById("respuesta");
const feedbackDiv = document.getElementById("feedback");
const puntajeDiv = document.getElementById("puntaje");
const btnResponder = document.getElementById("btnResponder");
const btnReiniciar = document.getElementById("btnReiniciar");
const historialDiv = document.getElementById("historial");
const timerRelojNumero = document.getElementById("timer-reloj-numero");
const timerRelojContainer = document.getElementById("timer-reloj-container");
const btnBorrarHistorial = document.getElementById("btnBorrarHistorial");

// --- Mostrar pantalla de inicio ---
pantallaInicio.style.display = "flex";
mainCard.style.display = "none";
timerRelojContainer.style.display = "none";

// --- Iniciar trivia solo cuando preguntas están listas ---
btnIniciar.addEventListener("click", () => {
    if (!preguntasCargadas || preguntas.length === 0) {
        Swal.fire({
            title: 'Cargando...',
            text: 'Las preguntas aún no están listas. Por favor, espera unos segundos e intenta de nuevo.',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    pantallaInicio.style.display = "none";
    mainCard.style.display = "block";
    timerRelojContainer.style.display = "flex";
    mostrarPregunta();
});

// --- Eventos principales ---
btnResponder.addEventListener("click", responderPregunta);
btnReiniciar.addEventListener("click", reiniciarJuego);
btnBorrarHistorial.addEventListener("click", borrarHistorial);

// Permitir responder con Enter
function enterHandler(e) {
    if (e.key === "Enter") responderPregunta();
}
respuestaInput.addEventListener("keydown", enterHandler);

// --- Mostrar pregunta actual ---
function mostrarPregunta() {
    preguntaDiv.textContent = preguntas[indice].texto;
    respuestaInput.value = "";
    respuestaInput.focus();
    puntajeDiv.textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
    puntajeDiv.style.textAlign = "center";
    preguntaDiv.style.textAlign = "center";
    iniciarTemporizador();
}

// --- Lógica de respuesta ---
function responderPregunta() {
    clearInterval(timerInterval);
    feedbackDiv.classList.remove("feedback-correcto", "feedback-incorrecto", "feedback-aviso", "feedback-tiempo");

    const respuestaUsuario = parseInt(respuestaInput.value);

    if (isNaN(respuestaUsuario)) {
        feedbackDiv.textContent = "⚠️ Por favor, ingresa un número válido.";
        feedbackDiv.classList.add("feedback-aviso");
        respuestaInput.value = "";
        respuestaInput.focus();
        iniciarTemporizador();
        return;
    }

    if (respuestaUsuario === preguntas[indice].respuestaCorrecta) {
        feedbackDiv.textContent = "✅ ¡Correcto!";
        feedbackDiv.classList.add("feedback-correcto");
        puntaje++;
    } else {
        feedbackDiv.textContent = `❌ Incorrecto. La respuesta era ${preguntas[indice].respuestaCorrecta}`;
        feedbackDiv.classList.add("feedback-incorrecto");
    }

    indice++;
    respuestaInput.value = "";

    if (indice < preguntas.length) {
        setTimeout(() => {
            mostrarPregunta();
            feedbackDiv.textContent = "";
            feedbackDiv.classList.remove("feedback-correcto", "feedback-incorrecto", "feedback-aviso");
        }, 1000);
    } else {
        puntajeDiv.textContent = `Tu puntaje final es: ${puntaje} de ${preguntas.length}`;
        puntajeDiv.style.textAlign = "center";
        btnResponder.disabled = true;
        respuestaInput.disabled = true;
        respuestaInput.removeEventListener("keydown", enterHandler);
        guardarResultado();
        Swal.fire({
            title: '¡Trivia finalizada!',
            text: `Tu puntaje es: ${puntaje}`,
            icon: 'success',
            showConfirmButton: false, 
            timer: 5000               
        });
    }
}

// --- Reiniciar juego ---
function reiniciarJuego() {
    indice = 0;
    puntaje = 0;
    puntajeDiv.textContent = "";
    feedbackDiv.textContent = "";
    btnResponder.disabled = false;
    respuestaInput.disabled = false;
    respuestaInput.addEventListener("keydown", enterHandler);
    mostrarPregunta();
}

// --- Temporizador visual ---
function iniciarTemporizador() {
    clearInterval(timerInterval);
    tiempoRestante = TIEMPO_POR_PREGUNTA;
    actualizarReloj();
    timerRelojContainer.style.display = "flex";
    timerInterval = setInterval(() => {
        tiempoRestante--;
        actualizarReloj();
        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            feedbackDiv.textContent = "⏰ ¡Tiempo agotado!";
            feedbackDiv.classList.remove("feedback-correcto", "feedback-incorrecto", "feedback-aviso");
            feedbackDiv.classList.add("feedback-tiempo");
            setTimeout(() => {
                indice++;
                if (indice < preguntas.length) {
                    mostrarPregunta();
                    feedbackDiv.textContent = "";
                    feedbackDiv.classList.remove("feedback-tiempo");
                } else {
                    puntajeDiv.textContent = `Tu puntaje final es: ${puntaje} de ${preguntas.length}`;
                    puntajeDiv.style.textAlign = "center";
                    btnResponder.disabled = true;
                    respuestaInput.disabled = true;
                    respuestaInput.removeEventListener("keydown", enterHandler);
                    guardarResultado();
                    Swal.fire({
                        title: '¡Trivia finalizada!',
                        text: `Tu puntaje es: ${puntaje}`,
                        icon: 'success',
                        showConfirmButton: false, 
                        timer: 5000               
                    });
                }
            }, 1000);
        }
    }, 1000);
}
function actualizarReloj() {
    timerRelojNumero.textContent = tiempoRestante;
}

// --- Historial de resultados ---
function guardarResultado() {
    const resultadosPrevios = JSON.parse(localStorage.getItem("resultados")) || [];
    resultadosPrevios.push({ puntaje, fecha: new Date().toLocaleString() });
    localStorage.setItem("resultados", JSON.stringify(resultadosPrevios));
    mostrarHistorial();
}
function mostrarHistorial() {
    const resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    if (resultados.length === 0) {
        historialDiv.innerHTML = "<h3 style='text-align:center;'>Historial de resultados</h3><p style='text-align:center;'>No hay resultados previos.</p>";
        return;
    }
    let html = "<h3 style='text-align:center;'>Historial de resultados</h3><ul style='list-style:none;padding:0;text-align:center;'>";
    resultados.slice(-5).reverse().forEach(r =>
        html += `<li>🗓️ ${r.fecha} — <strong>${r.puntaje}</strong> puntos</li>`
    );
    html += "</ul>";
    historialDiv.innerHTML = html;
}
function borrarHistorial() {
    localStorage.removeItem("resultados");
    mostrarHistorial();
}

// --- Inicializar historial al cargar ---
mostrarHistorial();
