import { useState } from "react";
import Inicio from "./componentes/Inicio";
import "./App.css";

const API_URL = "http://localhost:5000/api/partidas";

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
    if (datos.acerto) {
      setPistas([]);
      await avanzarRonda();
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
        <div>
          <h1>Batalla de Palabras</h1>
          {error && <p className="error">{error}</p>}
          <p>Turno de escribir la palabra: <strong>{jugadorQueEscribe}</strong></p>
          <p>(el otro jugador no debe mirar)</p>
          <input
            type="password"
            placeholder="Palabra secreta (4-8 letras)"
            value={palabraInput}
            onChange={(e) => setPalabraInput(e.target.value)}
          />
          <button onClick={enviarPalabra}>Confirmar palabra</button>
        </div>
      )}

      {pantalla === "adivinar" && (
        <div>
          <h1>Batalla de Palabras</h1>
          {error && <p className="error">{error}</p>}
          <p>Turno de adivinar: <strong>{jugadorQueAdivina}</strong></p>
          <p>La palabra tiene {largoPalabra} caracteres.</p>
          <input
            placeholder="Tu intento"
            value={intentoInput}
            onChange={(e) => setIntentoInput(e.target.value)}
          />
          <button onClick={enviarIntento}>Enviar intento</button>
          <ul>
            {pistas.map((p) => (
              <li key={p.posicion}>
                Posicion {p.posicion}: {p.correcta ? "correcta" : "incorrecta"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pantalla === "resumen" && resumen && (
        <div>
          <h2>Fin de la partida</h2>
          <p>Ganador: {resumen.ganador || "Empate"}</p>
          <ul>
            {resumen.rondas.map((r) => (
              <li key={r.numero}>
                Ronda {r.numero} - {r.jugadorQueAdivina}: {r.intentosTotales} intentos, {r.tiempoSegundos}s
              </li>
            ))}
          </ul>
          <button onClick={reiniciar}>Jugar de nuevo</button>
        </div>
      )}

      {pantalla === "historial" && (
        <div>
          <h2>Historial de partidas</h2>
          <ul>
            {historial.map((p) => (
              <li key={p.id}>
                {p.jugador1} vs {p.jugador2} - Ganador: {p.ganador || "Empate"}
              </li>
            ))}
          </ul>
          <button onClick={reiniciar}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default App;