function Inicio({ nombreA, setNombreA, nombreB, setNombreB, onIniciar, onVerHistorial, error }) {
  return (
    <div>
      <h1>Batalla de Palabras</h1>
      {error && <p className="error">{error}</p>}
      <input
        placeholder="Nombre jugador 1"
        value={nombreA}
        onChange={(e) => setNombreA(e.target.value)}
      />
      <input
        placeholder="Nombre jugador 2"
        value={nombreB}
        onChange={(e) => setNombreB(e.target.value)}
      />
      <button onClick={onIniciar}>Iniciar partida</button>
      <button onClick={onVerHistorial}>Ver historial</button>
    </div>
  );
}

export default Inicio;