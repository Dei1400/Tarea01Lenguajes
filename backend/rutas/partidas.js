// todas las rutas relacionadas con partidas van en este archivo
const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const juego = require("../logica/juego");
const estado = require("../datos/estado");

router.post("/", (req, res) => {
  // leer nombreJugadorA y nombreJugadorB de req.body
  // si falta alguno, responder error 400
  // usar juego.sortearJugadores para decidir jugador1 y jugador2
  // armar el objeto partida (id con crypto.randomUUID(), jugador1, jugador2, rondas con la primera ronda, estado "en_curso")
  // guardarla con estado.agregarPartida
  // responder con el id de la partida y de quien es el turno
});

router.get("/:id", (req, res) => {
  // buscar la partida con estado.buscarPartida(req.params.id)
  // si no existe, responder 404
  // si existe, responderla completa
});

router.post("/:id/palabra", (req, res) => {
  // buscar la partida y tomar la ultima ronda del arreglo de rondas
  // validar la palabra con juego.validarPalabra
  // si es valida, guardarla en la ronda y guardar el momento de inicio (Date.now())
  // responder el largo de la palabra y de quien es el turno de adivinar
});

router.post("/:id/intento", (req, res) => {
  // buscar la partida y la ronda actual
  // validar que ya haya palabra secreta y que la ronda no este completada
  // validar que el intento tenga el mismo largo que la palabra secreta
  // usar juego.compararIntento para obtener pistas y si acerto
  // guardar el intento en la ronda y sumar 1 a intentosTotales
  // si acerto, marcar la ronda como completada y calcular el tiempo usado
  // responder las pistas y si acerto
});

router.post("/:id/siguiente-ronda", (req, res) => {
  // buscar la partida y la ronda actual
  // si la ronda actual no esta completada, responder error
  // si ya van 6 rondas, calcular ganador con juego.calcularGanador, marcar partida finalizada y responder resumen
  // si no, crear la siguiente ronda alternando quien adivina y quien escribe
});

router.get("/", (req, res) => {
  // responder con estado.listarPartidas()
});

module.exports = router; // para exportar el router y poder usarlo en otros archivos