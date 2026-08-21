function validarPalabra(palabra) {
  // verificar que "palabra" sea un texto (usar typeof)
  // quitar espacios sobrantes y pasar a minusculas
  // verificar que tenga entre 4 y 8 caracteres de largo
  // verificar que cada caracter este en una lista de letras permitidas
  // devolver algo como { valido: true/false, palabra o error }
}

function sortearJugadores(nombreA, nombreB) {
  // generar un numero al azar (Math.random() da un decimal entre 0 y 1)
  // segun ese numero, decidir si nombreA es jugador1 o jugador2
  // devolver un objeto { jugador1, jugador2 }
}

function compararIntento(intento, palabraSecreta) {
  // recorrer cada posicion de la palabra secreta con un for
  // en cada posicion, comparar el caracter del intento contra el de la palabra secreta
  // armar un arreglo de pistas: [{ posicion, correcta }, ...]
  // determinar si el intento completo es igual a la palabra secreta (acerto)
  // devolver { pistas, acerto }
}

function calcularGanador(partida) {
  // sumar los intentosTotales de las rondas donde jugadorQueAdivina sea jugador1
  // hacer lo mismo para jugador2
  // el de menos intentos totales gana
  // si empatan en intentos, comparar la suma de tiempoSegundos de cada uno (Se necesita temporizador)
  // si tambien empatan en tiempo, es empate real
  // devolver { ganador, empate }
}

module.exports = { validarPalabra, sortearJugadores, compararIntento, calcularGanador };