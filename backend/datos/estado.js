let partidas = []; // arreglo para almacenar las partidas

function agregarPartida(partida) {
  // agregar "partida" al final del arreglo "partidas"
  partidas.push(partida);
}

function buscarPartida(id) {
  // devolver la partida cuyo campo "id" sea igual al parametro "id"
  return partidas.find((p) => p.id === id);
}

function listarPartidas() {
  // devolver el arreglo completo de partidas
  return partidas;
}

module.exports = { agregarPartida, buscarPartida, listarPartidas }; // es para exportar las funciones y poder usarlas en otros archivos