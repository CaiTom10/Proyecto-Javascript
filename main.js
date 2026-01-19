function Pregunta(texto, respuestaCorrecta) {
    this.texto = texto;
    this.respuestaCorrecta = respuestaCorrecta;
}

const preguntas = [
    new Pregunta("¿Cuánto es 22 + 178?", 200),
    new Pregunta("¿Cuánto es 200 - 50?", 150), 
    new Pregunta("¿Cuánto es 12 x 8?", 96),
    new Pregunta("¿Cuánto es 81 ÷ 9?", 9),
    new Pregunta("¿Cuánto es 15 x 7?", 105)
];

let puntaje = 0;
let indice = 0;

const preguntaDiv = document.getElementById("pregunta");
const respuestaInput = document.getElementById("respuesta");
const feedbackDiv = document.getElementById("feedback");
const puntajeDiv = document.getElementById("puntaje");
const btnResponder = document.getElementById("btnResponder");
const btnReiniciar = document.getElementById("btnReiniciar");
const historialDiv = document.getElementById("historial");
const timerBar = document.getElementById("timer-bar");
let timerInterval;
const TIEMPO_POR_PREGUNTA = 15; 
let tiempoRestante = TIEMPO_POR_PREGUNTA;


mostrarPregunta();
mostrarHistorial();

btnResponder.addEventListener("click", responderPregunta);

respuestaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        responderPregunta();
    }
});

function responderPregunta() {
    clearInterval(timerInterval);
    const respuestaUsuario = parseInt(respuestaInput.value);


    feedbackDiv.classList.remove("feedback-correcto", "feedback-incorrecto", "feedback-aviso", "feedback-tiempo");

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
    btnResponder.disabled = true;
    respuestaInput.disabled = true;
    guardarResultado();
    }
};

btnReiniciar.addEventListener("click", () => {
    indice = 0;
    puntaje = 0;
    puntajeDiv.textContent = "";
    feedbackDiv.textContent = "";
    btnResponder.disabled = false;
    respuestaInput.disabled = false;
    mostrarPregunta();
});

function mostrarPregunta() {
    preguntaDiv.textContent = preguntas[indice].texto;
    respuestaInput.value = "";
    respuestaInput.focus();
    puntajeDiv.textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
    iniciarTemporizador();
}

function iniciarTemporizador() {
    clearInterval(timerInterval);
    tiempoRestante = TIEMPO_POR_PREGUNTA;
    actualizarBarra();
    timerInterval = setInterval(() => {
    tiempoRestante--;
    actualizarBarra();
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
                btnResponder.disabled = true;
                respuestaInput.disabled = true;
                guardarResultado();
                }
            }, 1000);
        }
    }, 1000);
}

function actualizarBarra() {
    timerBar.style.width = `${(tiempoRestante / TIEMPO_POR_PREGUNTA) * 100}%`;
}


function guardarResultado() {
    const resultadosPrevios = JSON.parse(localStorage.getItem("resultados")) || [];
    resultadosPrevios.push({ puntaje, fecha: new Date().toLocaleString() });
    localStorage.setItem("resultados", JSON.stringify(resultadosPrevios));
    mostrarHistorial();
}

function mostrarHistorial() {
    const resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    if (resultados.length === 0) {
    historialDiv.innerHTML = "<h3>Historial de resultados</h3><p>No hay resultados previos.</p>";
    return;
    }
    let html = "<h3>Historial de resultados</h3><ul style='list-style:none;padding:0;'>";
    resultados.slice(-5).reverse().forEach(r =>
        html += `<li>🗓️ ${r.fecha} — <strong>${r.puntaje}</strong> puntos</li>`
    );
    html += "</ul>";
    historialDiv.innerHTML = html;
}

const btnBorrarHistorial = document.getElementById("btnBorrarHistorial");

btnBorrarHistorial.addEventListener("click", function() {
    localStorage.removeItem("resultados");
    mostrarHistorial();
});
