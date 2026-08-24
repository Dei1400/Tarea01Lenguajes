# Tarea01Lenguajes
# Tarea 1 – Aplicación Web: Batalla de Palabras

**Curso:** Lenguajes de Programación

**Semestre:** II, 2026

**Institución:** Instituto Tecnológico de Costa Rica

**Estudiante:** Deilyn Salazar

**Carnet:** 2020426180

## Descripción

Aplicación web con backend y frontend separados que implementa el juego
"Batalla de Palabras": dos jugadores se turnan para adivinar una palabra
secreta (escrita por el otro jugador) en el menor número de intentos
posible, a lo largo de 6 rondas (3 por jugador). El sistema también
mantiene un historial con los resultados de todas las partidas jugadas.

## Tecnologías

- **Backend:** Node.js + Express
- **Frontend:** React + Vite
- **Persistencia:**  archivo JSON  (`backend/datos/partidas.json`), sin motor de base de datos aparte

## Estructura del proyecto

```
Tarea01Lenguajes/
├── backend/
│   ├── server.js              # arranca Express y monta el router
│   ├── logica/
│   │   └── juego.js           # reglas del juego: validar palabra, sortear jugadores, comparar intento, calcular ganador
│   ├── datos/
│   │   ├── estado.js          # guarda/lee las partidas en memoria y en partidas.json
│   │   └── partidas.json      # se crea solo al jugar la primera partida
│   ├── rutas/
│   │   └── partidas.js        # endpoints de la API
│   └── jugar/
│       └── terminal.js        # cliente de prueba para jugar desde la terminal (sin frontend)
└── frontend/
    └── src/
        ├── App.jsx             # maneja las pantallas y las llamadas a la API
        ├── App.css             # estilos de toda la aplicación
        ├── assets/             # logo, mascotas, imágenes
        └── componentes/
            ├── Inicio.jsx      # pantalla de inicio 
            └── Adivinar.jsx    # pantalla de adivinar 

```
## Cómo correr el backend´
Backend y frontend son dos proyectos independientes; se corren en dos terminales al mismo tiempo.
 
**Backend** (puerto 5000):
 
```bash
cd backend
npm install
npm run dev
```
 
**Frontend** (puerto 5173):
 
```bash
cd frontend
npm install
npm run dev
```
Con las dos terminales corriendo, abrir `http://localhost:5173` en el navegador.

## Funcionalidades implementadas
 
- Inicio de partida pidiendo el nombre de los dos jugadores, con validación de nombres duplicados.
- Sorteo aleatorio de quién es jugador 1 y jugador 2.
- 6 rondas por partida (3 por jugador), alternando quién escribe la palabra y quién adivina.
- Validación de la palabra secreta: entre 4 y 8 caracteres, solo letras.
- Pistas por posición después de cada intento, mostradas en un grid de casillas de colores (estilo Wordle).
- Teclado virtual en pantalla para ingresar los intentos.
- Cronómetro visible que mide el tiempo que lleva cada ronda mientras el jugador adivina.
- Mensaje de éxito con botón manual para avanzar a la siguiente ronda (no avanza solo).
- Cálculo automático del ganador (por intentos totales, desempatando por tiempo) y pantalla de resumen con el detalle de cada ronda.
- Historial de partidas: tabla con todas las partidas finalizadas, mostrando intentos y tiempo acumulado por jugador y el ganador de cada una.
- Persistencia en disco: las partidas se guardan en `partidas.json`, por lo que el historial sobrevive a un reinicio del servidor.

## Endpoints de la API
 
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/partidas` | Crea una partida nueva, sortea jugador 1 y 2 |
| GET | `/api/partidas/:id` | Consulta el estado de una partida |
| POST | `/api/partidas/:id/palabra` | Registra la palabra secreta de la ronda actual |
| POST | `/api/partidas/:id/intento` | Envía un intento y devuelve las pistas |
| POST | `/api/partidas/:id/siguiente-ronda` | Avanza de ronda, o cierra la partida si ya se jugaron las 6 |
| GET | `/api/partidas` | Lista todas las partidas finalizadas (historial) |

