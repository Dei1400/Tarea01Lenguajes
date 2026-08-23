function Adivinar({
  jugadorQueAdivina,
  largoPalabra,
  intentoInput,
  setIntentoInput,
  onEnviarIntento,
  intentosHistorial,
  error,
}) {
  function agregarLetra(letra) {
    if (intentoInput.length < largoPalabra) {
      setIntentoInput(intentoInput + letra);
    }
  }

  function borrarLetra() {
    setIntentoInput(intentoInput.slice(0, -1));
  }

  const filaQ = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const filaA = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
  const filaZ = ["Z", "X", "C", "V", "B", "N", "M"];

  return (
    <div className="pantalla-adivinar">
      <h1>Batalla de Palabras</h1>

      <div className="etiqueta-turno">
        <p>Turno de adivinar: <strong>{jugadorQueAdivina}</strong></p>
        <p>La palabra tiene {largoPalabra} caracteres.</p>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid-adivinanza">
        {intentosHistorial.map((intento, filaIndex) => (
          <div className="fila-intento" key={filaIndex}>
            {intento.pistas.map((pista) => (
              <div
                key={pista.posicion}
                className={`celda ${pista.correcta ? "correcta" : "incorrecta"}`}
              >
                {intento.texto[pista.posicion - 1]}
              </div>
            ))}
          </div>
        ))}

        <div className="fila-intento">
          {Array.from({ length: largoPalabra }).map((_, i) => (
            <div key={i} className="celda celda-actual">
              {intentoInput[i] ? intentoInput[i].toUpperCase() : ""}
            </div>
          ))}
        </div>
      </div>

      <div className="teclado">
        <div className="fila-teclado">
          {filaQ.map((letra) => (
            <button key={letra} className="tecla" onClick={() => agregarLetra(letra)}>
              {letra}
            </button>
          ))}
        </div>
        <div className="fila-teclado">
          {filaA.map((letra) => (
            <button key={letra} className="tecla" onClick={() => agregarLetra(letra)}>
              {letra}
            </button>
          ))}
        </div>
        <div className="fila-teclado">
          <button className="tecla tecla-especial" onClick={onEnviarIntento}>
            ✓
          </button>
          {filaZ.map((letra) => (
            <button key={letra} className="tecla" onClick={() => agregarLetra(letra)}>
              {letra}
            </button>
          ))}
          <button className="tecla tecla-especial" onClick={borrarLetra}>
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}

export default Adivinar;