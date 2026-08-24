import { useState, useEffect, Fragment} from "react";
import Inicio from "./componentes/Inicio";
import "./App.css";
import Adivinar from "./componentes/Adivinar";
import mascotaNoVer from "./assets/no-ver.png";
import mascotaFin from "./assets/fin.png";



const API_URL = "http://localhost:5000/api/partidas";
function calcularTotales(partida, nombreJugador) {
  return partida.rondas
    .filter((r) => r.jugadorQueAdivina === nombreJugador)
    .reduce(
      (acc, r) => {
        acc.intentos += r.intentosTotales;
        acc.tiempo += r.tiempoSegundos;
        return acc;
      },
      { intentos: 0, tiempo: 0 }
    );
}

function App() {

  const [pantalla, setPantalla] = useState("inicio");
  const [nombreA, setNombreA] = useState("");
  const [nombreB, setNombreB] = useState("");
  const [partidaId, setPartidaId] = useState(null);
  const [jugadorQueEscribe, setJugadorQueEscribe] = useState("");
  const [jugadorQueAdivina, setJugadorQueAdivina] = useState("");
  const [largoPalabra, setLargoPalabra] = useState(0);
  const [palabraInput, setPalabraInput] = useState("");
  const [intentoInput, setIntentoInput] = useState("");
  const [pistas, setPistas] = useState([]);
  const [error, setError] = useState("");
  const [resumen, setResumen] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [intentosHistorial, setIntentosHistorial] = useState([]);
  const [rondaGanada, setRondaGanada] = useState(false);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);

  async function iniciarPartida() {
    setError("");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreJugadorA: nombreA, nombreJugadorB: nombreB }),
    });
    const datos = await res.json();
    if (res.status !== 200) {
      setError(datos.error);
      return;
    }
    setPartidaId(datos.id);
    setJugadorQueEscribe(datos.jugadorQueEscribe);
    setPantalla("escribirPalabra");
  }

  async function enviarPalabra() {
    setError("");
    const res = await fetch(`${API_URL}/${partidaId}/palabra`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ palabra: palabraInput }),
    });
    const datos = await res.json();
    if (res.status !== 200) {
      setError(datos.error);
      return;
    }
    setLargoPalabra(datos.largoPalabra);
    setJugadorQueAdivina(datos.jugadorQueAdivina);
    setPalabraInput("");
    setPistas([]);
    setIntentosHistorial([]);
    setRondaGanada(false);
    setTiempoTranscurrido(0);
    setPantalla("adivinar");
  }

  async function enviarIntento() {
    setError("");
    const res = await fetch(`${API_URL}/${partidaId}/intento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intento: intentoInput }),
    });
    const datos = await res.json();
    if (res.status !== 200) {
      setError(datos.error);
      return;
    }
    setIntentoInput("");
    setIntentosHistorial((prev) => [...prev, { texto: intentoInput, pistas: datos.pistas }]);
    if (datos.acerto) {
      setPistas([]);
      setRondaGanada(true); //boton para avanzar a la siguiente ronda
    } else {
      setPistas(datos.pistas);
    }

  }

  async function avanzarRonda() {
    const res = await fetch(`${API_URL}/${partidaId}/siguiente-ronda`, { method: "POST" });
    const datos = await res.json();
    if (datos.finDePartida) {
      setResumen(datos.resumen);
      setPantalla("resumen");
    } else {
      setJugadorQueEscribe(datos.jugadorQueEscribe);
      setPantalla("escribirPalabra");
    }
  }

  async function verHistorial() {
    const res = await fetch(API_URL);
    const datos = await res.json();
    setHistorial(datos);
    setPantalla("historial");
  }

  function reiniciar() {
    setPantalla("inicio");
    setNombreA("");
    setNombreB("");
    setPartidaId(null);
    setResumen(null);
    setError("");
  }
  useEffect(() => {
    if (pantalla !== "adivinar" || rondaGanada) return;
    const intervalo = setInterval(() => {
      setTiempoTranscurrido((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [pantalla, rondaGanada]);

  return (
    <div className="app">
      {pantalla === "inicio" && (
        <Inicio
          nombreA={nombreA}
          setNombreA={setNombreA}
          nombreB={nombreB}
          setNombreB={setNombreB}
          onIniciar={iniciarPartida}
          onVerHistorial={verHistorial}
          error={error}
        />
      )}

     {pantalla === "escribirPalabra" && (
        <div className="pantalla-escribir">
          <img src={mascotaNoVer} alt="no mires" className="mascota" />
          <h1>Batalla de Palabras</h1>
          <div className="etiqueta-turno">
            <p>Turno de escribir la palabra: <strong>{jugadorQueEscribe}</strong></p>
            <p>(el otro jugador no debe mirar)</p>
          </div>
          {error && <p className="error">{error}</p>}
          <input
            className="input-palabra"
            placeholder="Palabra secreta (4-8 letras)"
            value={palabraInput}
            onChange={(e) => setPalabraInput(e.target.value)}
          />
          <button onClick={enviarPalabra}>Confirmar palabra</button>
        </div>
      )}

      {pantalla === "adivinar" && (
        <Adivinar
          jugadorQueAdivina={jugadorQueAdivina}
          largoPalabra={largoPalabra}
          intentoInput={intentoInput}
          setIntentoInput={setIntentoInput}
          onEnviarIntento={enviarIntento}
          intentosHistorial={intentosHistorial}
          error={error}
          rondaGanada={rondaGanada}
          onSiguienteRonda={avanzarRonda}
          tiempoTranscurrido={tiempoTranscurrido}
        />
      )}
      {pantalla === "resumen" && resumen && (
        <div className="pantalla-resumen">
          <img src={mascotaFin} alt="fin del juego" className="mascota" />
          <h2>Fin de la partida</h2>
          <div className="etiqueta-ganador">
            <p>Ganador: <strong>{resumen.ganador || "Empate"}</strong></p>
          </div>

          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Ronda</th>
                  <th>Jugador</th>
                  <th>Intentos</th>
                  <th>Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {resumen.rondas.map((r) => (
                  <tr key={r.numero}>
                    <td>{r.numero}</td>
                    <td>{r.jugadorQueAdivina}</td>
                    <td>{r.intentosTotales}</td>
                    <td>{r.tiempoSegundos}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={reiniciar}>Jugar de nuevo</button>
        </div>
      )}
      {pantalla === "historial" && (
        <div className="pantalla-historial">
          <h2>Historial de partidas</h2>

          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Partida</th>
                  <th>Jugador</th>
                  <th>Intentos</th>
                  <th>Tiempo</th>
                  <th>Ganador</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((p) => {
                  const totalesJ1 = calcularTotales(p, p.jugador1);
                  const totalesJ2 = calcularTotales(p, p.jugador2);
                  return (
                    <Fragment key={p.id}>
                      <tr>
                        <td rowSpan={2}>{p.jugador1} vs {p.jugador2}</td>
                        <td>{p.jugador1}</td>
                        <td>{totalesJ1.intentos}</td>
                        <td>{totalesJ1.tiempo}s</td>
                        <td rowSpan={2}>{p.ganador || "Empate"}</td>
                      </tr>
                      <tr>
                        <td>{p.jugador2}</td>
                        <td>{totalesJ2.intentos}</td>
                        <td>{totalesJ2.tiempo}s</td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button onClick={reiniciar}>Volver</button>
        </div>
      )}
      
    </div>
  );
}

export default App;