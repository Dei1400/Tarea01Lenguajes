// express router para manejar las rutas relacionadas con las partidas
// crypto para generar ids unicos de partidas
///router para manejar las rutas relacionadas con las partidas
//todos estos son los metodos que se van a usar para manejar las partidas
const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const juego = require("../logica/juego");
const estado = require("../datos/estado");
// para crear una nueva ronda, se necesita el numero de ronda, el jugador que adivina y el jugador que escribe

function crearRonda(numero, jugadorQueAdivina, jugadorQueEscribe) { 
  //para crear una nueva ronda se devulve un objeto  con numero, jugadorQueAdivina, jugadorQueEscribe, palabraSecreta, intentos, intentosTotales, tiempoSegundos y completada
  return { numero, jugadorQueAdivina, jugadorQueEscribe,
    palabraSecreta: null,
    intentos: [],
    intentosTotales: 0,
    tiempoSegundos: 0,
    completada: false,
  };
}

router.post("/", (req, res) => {
  const { nombreJugadorA, nombreJugadorB } = req.body;
  if (!nombreJugadorA || !nombreJugadorB) {
    return res.status(400).json({ error: "Faltan los nombres de los dos jugadores." });
  }

  if (nombreJugadorA.trim().toLowerCase() === nombreJugadorB.trim().toLowerCase()) {
    return res.status(400).json({ error: "Los dos jugadores deben tener nombres distintos." });
  }

  const { jugador1, jugador2 } = juego.sortearJugadores(nombreJugadorA, nombreJugadorB);

  const partida = {
    id: crypto.randomUUID(),
    jugador1,
    jugador2,
    rondas: [crearRonda(1, jugador1, jugador2)],
    estado: "en_curso",
    ganador: null,
    fechaHora: new Date().toISOString(),
  };

  estado.agregarPartida(partida);

  res.json({
    id: partida.id,
    turno: "escribir_palabra",
    jugadorQueEscribe: partida.rondas[0].jugadorQueEscribe,
  });
});

router.get("/:id", (req, res) => {
  const partida = estado.buscarPartida(req.params.id);
  if (!partida) return res.status(404).json({ error: "Partida no encontrada." });
  res.json(partida);
});

router.post("/:id/palabra", (req, res) => {
  const partida = estado.buscarPartida(req.params.id);
  if (!partida) return res.status(404).json({ error: "Partida no encontrada." });

  const ronda = partida.rondas[partida.rondas.length - 1];
  if (ronda.palabraSecreta) {
    return res.status(400).json({ error: "Esta ronda ya tiene palabra secreta." });
  }

  const resultado = juego.validarPalabra(req.body.palabra);
  if (!resultado.valido) return res.status(400).json({ error: resultado.error });

  ronda.palabraSecreta = resultado.palabra;
  ronda.inicioMs = Date.now(); //para calcular el tiempo que tarda el jugador en adivinar la palabra, se guarda el timestamp de inicio de la ronda

  res.json({
    largoPalabra: resultado.palabra.length,
    turno: "adivinar",
    jugadorQueAdivina: ronda.jugadorQueAdivina,
  });
});

router.post("/:id/intento", (req, res) => {
  const partida = estado.buscarPartida(req.params.id);
  if (!partida) return res.status(404).json({ error: "Partida no encontrada." });

  const ronda = partida.rondas[partida.rondas.length - 1];
  if (!ronda.palabraSecreta) {
    return res.status(400).json({ error: "Todavia no se definio la palabra secreta de esta ronda." });
  }
  if (ronda.completada) {
    return res.status(400).json({ error: "Esta ronda ya termino." });
  }

  const { intento } = req.body;
  if (!intento || intento.length !== ronda.palabraSecreta.length) {
    return res.status(400).json({ error: `El intento debe tener ${ronda.palabraSecreta.length} caracteres.` });
  }

  const { pistas, acerto } = juego.compararIntento(intento, ronda.palabraSecreta);

  ronda.intentos.push({ texto: intento, pistas, timestamp: new Date().toISOString() });
  ronda.intentosTotales += 1;

  if (acerto) {
    ronda.completada = true;
    ronda.tiempoSegundos = Math.round((Date.now() - ronda.inicioMs) / 1000);
  }

  res.json({ pistas, acerto, intentosUsados: ronda.intentosTotales });
});

router.post("/:id/siguiente-ronda", (req, res) => {
  const partida = estado.buscarPartida(req.params.id);
  if (!partida) return res.status(404).json({ error: "Partida no encontrada." });

  const ronda = partida.rondas[partida.rondas.length - 1];
  if (!ronda.completada) {
    return res.status(400).json({ error: "La ronda actual todavia no termino." });
  }

  if (partida.rondas.length >= 6) {
    const resultado = juego.calcularGanador(partida);
    partida.estado = "finalizada";
    partida.ganador = resultado.ganador;
    partida.empate = resultado.empate;
    return res.json({ finDePartida: true, resumen: partida });
  }

  const nuevaRonda = crearRonda(partida.rondas.length + 1, ronda.jugadorQueEscribe, ronda.jugadorQueAdivina);
  partida.rondas.push(nuevaRonda);

  res.json({
    finDePartida: false,
    turno: "escribir_palabra",
    jugadorQueEscribe: nuevaRonda.jugadorQueEscribe,
  });
});

router.get("/", (req, res) => {
  const finalizadas = estado.listarPartidas().filter((p) => p.estado === "finalizada"); //para filtrar las partidas finalizadas
  res.json(estado.listarPartidas());
});

module.exports = router;