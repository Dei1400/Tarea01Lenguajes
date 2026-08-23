function validarPalabra(palabra) {
  if (typeof palabra !== "string") {   // verificar que "palabra" sea un texto con typeof
    return { valido: false, error: "La palabra debe ser texto." };
  }

  const limpia = palabra.trim().toLowerCase();  // quitar espacios sobrantes y pasar a minusculas 

  if (limpia.length < 4 || limpia.length > 8) { // verificar que tenga entre 4 y 8 caracteres de largo
    return { valido: false, error: "La palabra debe tener entre 4 y 8 caracteres." };
  }

  const letrasPermitidas = "abcdefghijklmnopqrstuvwxyzáéíóúñ";

  for (let i = 0; i < limpia.length; i++) {  // verificar que cada caracter este en una lista de letras permitidas
    const caracter = limpia[i];
    if (!letrasPermitidas.includes(caracter)) {
      return { valido: false, error: "La palabra solo puede contener letras." };
    }
  }

  return { valido: true, palabra: limpia };   // devolver algo como { valido: true/false, palabra o error }
}

function sortearJugadores(nombreA, nombreB) {
  // generar un numero al azar  con Math.random() da un decimal entre 0 y 1. segun ese numero, decidir si nombreA es jugador1 o jugador2. devolver un objeto { jugador1, jugador2 }
  const azar = Math.random() < 0.5;
  return azar
    ? { jugador1: nombreA, jugador2: nombreB }
    : { jugador1: nombreB, jugador2: nombreA };

  }

function compararIntento(intento, palabraSecreta) {
  // en cada posicion, comparar el caracter del intento contra el de la palabra secreta
  // determinar si el intento completo es igual a la palabra secreta
  // devolver { pistas, acerto }
  const intentoNorm = intento.trim().toLowerCase(); //para evitar problemas de mayusculas y espacios sobrantes, normalizar el intento y la palabra secreta
  const secretaNorm = palabraSecreta.trim().toLowerCase();

  const pistas = [];
  for (let i = 0; i < secretaNorm.length; i++) {
    pistas.push({ posicion: i + 1, correcta: intentoNorm[i] === secretaNorm[i] });
  }

  const acerto = intentoNorm === secretaNorm;
  return { pistas, acerto };
}

function calcularGanador(partida) {
  const sumaPorJugador = (nombre, campo) =>
    partida.rondas.filter((r) => r.jugadorQueAdivina === nombre).reduce((total, r) => total + r[campo], 0); //para cada jugador, filtrar las rondas donde fue el que adivinó y sumar el campo indicado (intentosTotales o tiempoSegundos)

  const intentos1 = sumaPorJugador(partida.jugador1, "intentosTotales");
  const intentos2 = sumaPorJugador(partida.jugador2, "intentosTotales");

  //comparaciones

  if (intentos1 < intentos2) return { ganador: partida.jugador1, empate: false };
  if (intentos2 < intentos1) return { ganador: partida.jugador2, empate: false };

  const tiempo1 = sumaPorJugador(partida.jugador1, "tiempoSegundos");
  const tiempo2 = sumaPorJugador(partida.jugador2, "tiempoSegundos");

  if (tiempo1 < tiempo2) return { ganador: partida.jugador1, empate: false };
  if (tiempo2 < tiempo1) return { ganador: partida.jugador2, empate: false };

  return { ganador: null, empate: true }; // si ambos jugadores tienen el mismo puntaje y tiempo, es un empate
}

module.exports = { validarPalabra, sortearJugadores, compararIntento, calcularGanador };