const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

const BASE_URL = "http://localhost:5000/api/partidas";

async function jugar() {
  console.log("=== BATALLA DE PALABRAS (modo terminal) ===\n");

  const nombreJugadorA = await preguntar("Nombre del jugador 1: ");
  const nombreJugadorB = await preguntar("Nombre del jugador 2: ");

  const resCrear = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreJugadorA, nombreJugadorB }),
  });
  const datosCrear = await resCrear.json();

  if (resCrear.status !== 200) {
    console.log("Error al crear la partida:", datosCrear.error);
    rl.close();
    return;
  }

  const id = datosCrear.id;
  let jugadorQueEscribe = datosCrear.jugadorQueEscribe;

  console.log(`\nPartida creada (sorteo hecho por el sistema).`);

  let finDePartida = false;

  while (!finDePartida) {
    console.log(`\n--- Le toca escribir la palabra a: ${jugadorQueEscribe} ---`);
    console.log("(el otro jugador no mire la pantalla)");

    let palabraValida = false;
    let jugadorQueAdivina, largoPalabra;

    while (!palabraValida) {
      const palabra = await preguntar(`${jugadorQueEscribe}, escribi la palabra secreta: `);

      const resPalabra = await fetch(`${BASE_URL}/${id}/palabra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ palabra }),
      });
      const datosPalabra = await resPalabra.json();

      if (resPalabra.status !== 200) {
        console.log("Error:", datosPalabra.error);
      } else {
        palabraValida = true;
        largoPalabra = datosPalabra.largoPalabra;
        jugadorQueAdivina = datosPalabra.jugadorQueAdivina;
      }
    }

    console.log(`\n${jugadorQueAdivina}, la palabra tiene ${largoPalabra} caracteres. ¡A adivinar!`);

    let acerto = false;
    while (!acerto) {
      const intento = await preguntar(`${jugadorQueAdivina}, tu intento: `);

      const resIntento = await fetch(`${BASE_URL}/${id}/intento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intento }),
      });
      const datosIntento = await resIntento.json();

      if (resIntento.status !== 200) {
        console.log("Error:", datosIntento.error);
        continue;
      }

      if (datosIntento.acerto) {
        console.log(`¡Correcto! Usaste ${datosIntento.intentosUsados} intento(s) en esta ronda.`);
        acerto = true;
      } else {
        console.log("Pistas:");
        datosIntento.pistas.forEach((p) => {
          console.log(`  posicion ${p.posicion}: ${p.correcta ? "correcta" : "incorrecta"}`);
        });
      }
    }

    const resSiguiente = await fetch(`${BASE_URL}/${id}/siguiente-ronda`, {
      method: "POST",
    });
    const datosSiguiente = await resSiguiente.json();

    if (datosSiguiente.finDePartida) {
      finDePartida = true;
      console.log("\n=== FIN DE LA PARTIDA ===");
      console.log(JSON.stringify(datosSiguiente.resumen, null, 2));
    } else {
      jugadorQueEscribe = datosSiguiente.jugadorQueEscribe;
    }
  }

  rl.close();
}

jugar();