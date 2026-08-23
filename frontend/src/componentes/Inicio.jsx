import logo from "../assets/logo-adivina.png";
function Inicio({ nombreA, setNombreA, nombreB, setNombreB, onIniciar, onVerHistorial, error }) {
  return (
    <div className="pantalla-inicio">
      <img src={logo} alt="Adivina la palabra" className="logo" />

      {error && <p className="error">{error}</p>}

      <input
        className="input-nombre"
        placeholder="Nombre jugador 1"
        value={nombreA}
        onChange={(e) => setNombreA(e.target.value)}
      />
      <input
        className="input-nombre"
        placeholder="Nombre jugador 2"
        value={nombreB}
        onChange={(e) => setNombreB(e.target.value)}
      />

      <div className="botones-inicio">
        <button onClick={onIniciar}>Iniciar partida</button>
        <button onClick={onVerHistorial}>Ver historial</button>
      </div>
    </div>
  );
}

export default Inicio;