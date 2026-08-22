function validarPalabra(palabra) {
  // verificar que "palabra" sea un texto (usar typeof)
  // quitar espacios sobrantes y pasar a minusculas
  // verificar que tenga entre 4 y 8 caracteres de largo
  // verificar que cada caracter este en una lista de letras permitidas
  // devolver algo como { valido: true/false, palabra o error }

  if (typeof palabra !== "string") {
    return { valido: false, error: "La palabra debe ser texto." };
  }

  const limpia = palabra.trim().toLowerCase();

  if (limpia.length < 4 || limpia.length > 8) {
    return { valido: false, error: "La palabra debe tener entre 4 y 8 caracteres." };
  }

  const letrasPermitidas = "abcdefghijklmnopqrstuvwxyzáéíóúñ";

  for (let i = 0; i < limpia.length; i++) {
    const caracter = limpia[i];
    if (!letrasPermitidas.includes(caracter)) {
      return { valido: false, error: "La palabra solo puede contener letras." };
    }
  }

  return { valido: true, palabra: limpia };
}

function sortearJugadores(nombreA, nombreB) {
  // generar un numero al azar (Math.random() da un decimal entre 0 y 1)
  // segun ese numero, decidir si nombreA es jugador1 o jugador2
  // devolver un objeto { jugador1, jugador2 }
  const azar = Math.random() < 0.5;
  return azar
    ? { jugador1: nombreA, jugador2: nombreB }
    : { jugador1: nombreB, jugador2: nombreA };

  }

function compararIntento(intento, palabraSecreta) {
  // recorrer cada posicion de la palabra secreta con un for
  // en cada posicion, comparar el caracter del intento contra el de la palabra secreta
  // armar un arreglo de pistas: [{ posicion, correcta }, ...]
  // determinar si el intento completo es igual a la palabra secreta (acerto)
  // devolver { pistas, acerto }
  const intentoNorm = intento.trim().toLowerCase();
  const secretaNorm = palabraSecreta.trim().toLowerCase();

  const pistas = [];
  for (let i = 0; i < secretaNorm.length; i++) {
    pistas.push({ posicion: i + 1, correcta: intentoNorm[i] === secretaNorm[i] });
  }

  const acerto = intentoNorm === secretaNorm;
  return { pistas, acerto };
}

function calcularGanador(partida) {
  // sumar los intentosTotales de las rondas donde jugadorQueAdivina sea jugador1
  // hacer lo mismo para jugador2
  // el de menos intentos totales gana
  // si empatan en intentos, comparar la suma de tiempoSegundos de cada uno (Se necesita temporizador)
  // si tambien empatan en tiempo, es empate real
  // devolver { ganador, empate }

  const sumaPorJugador = (nombre, campo) =>
    partida.rondas
      .filter((r) => r.jugadorQueAdivina === nombre)
      .reduce((total, r) => total + r[campo], 0);

  const intentos1 = sumaPorJugador(partida.jugador1, "intentosTotales");
  const intentos2 = sumaPorJugador(partida.jugador2, "intentosTotales");

  if (intentos1 < intentos2) return { ganador: partida.jugador1, empate: false };
  if (intentos2 < intentos1) return { ganador: partida.jugador2, empate: false };

  const tiempo1 = sumaPorJugador(partida.jugador1, "tiempoSegundos");
  const tiempo2 = sumaPorJugador(partida.jugador2, "tiempoSegundos");

  if (tiempo1 < tiempo2) return { ganador: partida.jugador1, empate: false };
  if (tiempo2 < tiempo1) return { ganador: partida.jugador2, empate: false };

  return { ganador: null, empate: true };
}

module.exports = { validarPalabra, sortearJugadores, compararIntento, calcularGanador };