const fs = require("fs");
const path = require("path");

const RUTA_ARCHIVO = path.join(__dirname, "partidas.json");

function cargarPartidas() {
  if (fs.existsSync(RUTA_ARCHIVO)) {
    const contenido = fs.readFileSync(RUTA_ARCHIVO, "utf-8");
    try {
      return JSON.parse(contenido);
    } catch (error) {
      return [];
    }
  }
  return [];
}

let partidas = cargarPartidas(); // cargar las partidas desde el archivo JSON al iniciar el servidor

function guardarPartidas() {
  fs.writeFileSync(RUTA_ARCHIVO, JSON.stringify(partidas, null, 2));
}

function agregarPartida(partida) {
  // agregar "partida" al final del arreglo "partidas"
  partidas.push(partida);
  guardarPartidas(); //para guardar las partidas en el archivo JSON
}

function buscarPartida(id) {
  // para buscar una partida por su id
  return partidas.find((p) => p.id === id);
}

function listarPartidas() {
  // devolver el arreglo completo de partidas
  return partidas;
}

module.exports = { agregarPartida, buscarPartida, listarPartidas, guardarPartidas  }; // es para exportar las funciones y poder usarlas en otros archivos