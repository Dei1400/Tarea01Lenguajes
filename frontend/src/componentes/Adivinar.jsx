function Adivinar({
  jugadorQueAdivina,
  largoPalabra,
  intentoInput,
  setIntentoInput,
  onEnviarIntento,
  intentosHistorial,
  error,
}) {
  return (
    <div className="pantalla-adivinar">
      <h1>Batalla de Palabras</h1>
      <p>Turno de adivinar: <strong>{jugadorQueAdivina}</strong></p>
      <p>La palabra tiene {largoPalabra} caracteres.</p>

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
      </div>

      <div className="fila-input">
        <input
          className="input-palabra"
          placeholder="Tu intento"
          value={intentoInput}
          maxLength={largoPalabra}
          onChange={(e) => setIntentoInput(e.target.value)}
        />
        <button onClick={onEnviarIntento}>Enviar intento</button>
      </div>
    </div>
  );
}

export default Adivinar;