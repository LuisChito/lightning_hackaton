# ⚡ Lightning Quest – Plan del Proyecto

Simulador educativo de *Lightning Network* en formato interactivo / videojuego.

El objetivo es permitir que los usuarios *aprendan cómo funciona Lightning creando nodos, abriendo canales y enviando pagos* dentro de una red simulada.

---

# 📌 Objetivo del Proyecto

Crear una plataforma visual donde el usuario pueda:

- Crear nodos
- Abrir canales Lightning
- Enviar pagos
- Visualizar rutas de pagos
- Entender cómo funciona Lightning Network

---

# 🧠 Decisiones del Proyecto

Marcar la opción elegida.

## Simulación vs Lightning Real

- [ ] Simular Lightning completamente (recomendado para hackathon)
- [ ] Usar nodos Lightning reales en testnet

---

## Backend Framework

- [ ] Node.js + Express
- [ ] Node.js + NestJS
- [ ] Python + FastAPI
- [ ] Otro: ___

---

## Frontend Framework

- [ ] React
- [ ] React + React Flow (recomendado)
- [ ] Vue
- [ ] Otro: ___

---

## Base de Datos

- [ ] PostgreSQL
- [ ] SQLite
- [ ] MongoDB
- [ ] Sin base de datos (memoria)

---

## Comunicación en tiempo real

- [ ] WebSocket
- [ ] Socket.io
- [ ] Polling simple

---

# 🧩 Funcionalidades del MVP

Estas son las *features mínimas para que el proyecto funcione*.

## Sistema de nodos

- [ ] Crear nodo
- [ ] Listar nodos
- [ ] Mostrar balance
- [ ] Mostrar estado del nodo

---

## Sistema de canales

- [ ] Abrir canal
- [ ] Listar canales
- [ ] Mostrar liquidez
- [ ] Visualizar conexión entre nodos

---

## Sistema de pagos

- [ ] Enviar pago
- [ ] Buscar ruta
- [ ] Validar liquidez
- [ ] Registrar pago

---

## Visualización de red

- [ ] Mostrar nodos
- [ ] Mostrar canales
- [ ] Animación de pago
- [ ] Mostrar ruta del pago

---

## Sistema educativo

- [ ] Mostrar explicación después de cada pago
- [ ] Mostrar cómo se eligió la ruta
- [ ] Mostrar conceptos Lightning explicados

---

# ⚡ Contratos API

Base URL:


/api/v1


Formato de datos:


application/json


---

# 🔌 Endpoints

## Nodos

### Crear nodo

*POST*


/api/v1/nodes


Request

json
{
  "name": "Nodo A"
}


Response

json
{
  "id": "node_123",
  "name": "Nodo A",
  "balance": 1000,
  "status": "active"
}


---

### Obtener nodos

*GET*


/api/v1/nodes


Response

json
{
  "nodes": [
    {
      "id": "node_1",
      "name": "Nodo A",
      "balance": 1000,
      "status": "active"
    },
    {
      "id": "node_2",
      "name": "Nodo B",
      "balance": 800,
      "status": "active"
    }
  ]
}


---

## Canales

### Crear canal

*POST*


/api/v1/channels


Request

json
{
  "nodeA": "node_1",
  "nodeB": "node_2",
  "capacity": 500
}


Response

json
{
  "id": "channel_1",
  "nodeA": "node_1",
  "nodeB": "node_2",
  "capacity": 500,
  "liquidityA": 250,
  "liquidityB": 250
}


---

### Obtener canales

*GET*


/api/v1/channels


Response

json
{
  "channels": [
    {
      "id": "channel_1",
      "nodeA": "node_1",
      "nodeB": "node_2",
      "capacity": 500,
      "liquidityA": 250,
      "liquidityB": 250
    }
  ]
}


---

## Pagos

### Enviar pago

*POST*


/api/v1/payments


Request

json
{
  "source": "node_1",
  "destination": "node_4",
  "amount": 100
}


Response éxito

json
{
  "status": "success",
  "route": ["node_1", "node_2", "node_3", "node_4"],
  "fees": 2,
  "message": "Pago completado"
}


Response error

json
{
  "status": "failed",
  "reason": "Insufficient liquidity"
}


---

### Historial de pagos

*GET*


/api/v1/payments


Response

json
{
  "payments": [
    {
      "id": "pay_1",
      "source": "node_1",
      "destination": "node_4",
      "amount": 100,
      "status": "success",
      "route": ["node_1", "node_2", "node_3", "node_4"]
    }
  ]
}


---

## Estado completo de red

*GET*


/api/v1/network


Response

json
{
  "nodes": [],
  "channels": [],
  "payments": []
}


---

# 🧱 Modelos de Datos

## Node


id
name
balance
status


---

## Channel


id
nodeA
nodeB
capacity
liquidityA
liquidityB


---

## Payment


id
source
destination
amount
route
status


---

# 🎮 Sistema de Misiones

- [ ] Crear primer nodo
- [ ] Abrir primer canal
- [ ] Enviar primer pago
- [ ] Enviar pago usando 3 nodos intermediarios
- [ ] Optimizar liquidez

---

# 📊 Estadísticas del Jugador

- [ ] Pagos enviados
- [ ] Pagos exitosos
- [ ] Número de nodos
- [ ] Número de canales
- [ ] Fees pagados

---

# 🎨 Frontend UI

## Pantallas

- [ ] Pantalla principal (mapa de red)
- [ ] Panel de acciones
- [ ] Ventana de pagos
- [ ] Panel educativo
- [ ] Estadísticas

---

# ⚡ Sistema en Tiempo Real

Eventos posibles:

- payment_started
- payment_routing
- payment_completed
- channel_opened
- node_offline

---

# 🚀 Bonus para impresionar a jueces

- [ ] Animación visual de pagos
- [ ] Simulación automática de red
- [ ] AI Lightning Tutor
- [ ] Visualización estilo videojuego
- [ ] Modo sandbox

---

# 👥 Roles del Equipo

## Backend

Responsable de:

- API
- Simulación de Lightning
- Routing de pagos
- Base de datos

Responsable: ___

---

## Frontend

Responsable de:

- UI
- Visualización de nodos
- Animaciones
- Interacción

Responsable: ___

---

## Diseño / UX

Responsable de:

- Experiencia educativa
- Interfaz del juego
- Tutoriales

Responsable: ___

---

# 🗺 Roadmap del Hackathon

## Fase 1

- [ ] Crear estructura del proyecto
- [ ] Implementar nodos
- [ ] Implementar canales

---

## Fase 2

- [ ] Implementar pagos
- [ ] Implementar routing

---

## Fase 3

- [ ] Visualización de red
- [ ] Animación de pagos

---

## Fase 4

- [ ] Sistema educativo
- [ ] Misiones

---

# 🏁 Meta Final

Un usuario debe poder:

1️⃣ Crear nodos  
2️⃣ Conectarlos  
3️⃣ Enviar pagos  
4️⃣ Ver cómo se enruta el pago  
5️⃣ Aprender cómo funciona Lightning Network