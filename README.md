# Tarea01Lenguajes
# Tarea 1 – Aplicación Web: Batalla de Palabras

**Curso:** Lenguajes de Programación
**Semestre:** II, 2026
**Institución:** Instituto Tecnológico de Costa Rica
**Estudiante:** [Deilyn Salazar]
**Carnet:** [2020426180]

## Descripción

Aplicación web con backend y frontend separados que implementa el juego
"Batalla de Palabras": dos jugadores se turnan para adivinar una palabra
secreta (escrita por el otro jugador) en el menor número de intentos
posible, a lo largo de 6 rondas (3 por jugador). El sistema también
mantiene un historial con los resultados de todas las partidas jugadas.

## Tecnologías

- **Backend:** Node.js + Express
- **Frontend:** React (pendiente de implementar)
- **Persistencia:** en memoria por el momento (sujeto a cambio)

## Estructura del proyecto

```
Tarea01Lenguajes/
├── backend/
│ ├── server.js
│ ├── datos/
│ │ └── estado.js
│ ├── logica/
│ │ └── juego.js
│ └── rutas/
│ └── partidas.js
└── frontend/ (aun no iniciado)

```
## Cómo correr el backend´
```
cd backend
npm install
npm run dev
```
El servidor queda escuchando en `http://localhost:5000`.

## Endpoints disponibles (backend)

| Método | Ruta | Descripción |
|-------|-------------------------------------|------------------------------------------------|
| POST  | `/api/partidas`                     | Crea una partida nueva y sortea los jugadores  |
| GET   | `/api/partidas/:id`                 | Consulta el estado actual de una partida       |
| POST  | `/api/partidas/:id/palabra`         | Registra la palabra secreta de la ronda actual |
| POST  | `/api/partidas/:id/intento`         | Envía un intento de adivinanza                 |
| POST  | `/api/partidas/:id/siguiente-ronda` | Cierra la ronda actual y avanza a la siguiente |
| GET   | `/api/partidas`                     | Lista el historial de partidas                 |