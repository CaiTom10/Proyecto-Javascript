function Sumar(a, b) {
  return a + b;
}

const preguntas = [
    {
        num1: 3,
        num2: 5,
        texto: "¿Cuánto es 3 + 5?",
        respuestaCorrecta: 8
    },
    {
        num1: 7,
        num2: 2,
        texto: "¿Cuánto es 7 + 2?",
        respuestaCorrecta: 9
    },
    {
        num1: 4,
        num2: 6,
        texto: "¿Cuánto es 4 + 6?",
        respuestaCorrecta: 10
    }
];

let puntaje = 0;
let i = 0;

while (i < preguntas.length) {
    const pregunta = preguntas[i];
    let respuesta = prompt(`Pregunta ${i + 1}: ${pregunta.texto}`);

    if (parseInt(respuesta) === Sumar(pregunta.num1, pregunta.num2)) {
        alert("¡Correcto!");
        puntaje++;
    } else {
    alert(`Incorrecto. La respuesta era ${pregunta.respuestaCorrecta}`);
    }

    console.log(`Pregunta ${i + 1}: ${pregunta.texto} → Respuesta correcta: ${pregunta.respuestaCorrecta}`); 
    i++;
}

let mostrarResultado = true;
do {
    alert(`Tu puntaje final es: ${puntaje} de ${preguntas.length}`);
    mostrarResultado = false;
} while (mostrarResultado);


