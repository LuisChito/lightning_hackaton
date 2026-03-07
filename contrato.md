# ⚡ Lightning Network — Diagramas de Flujo

---

## Crear Canal

```mermaid
flowchart TD
    A([Nodo A]) --> B["Nodo A y Nodo B crean un multisig 2-of-2
    (requiere firma de ambos para transaccionar)"]
    B --> C["Nodo A envía C (capacidad de canal) sats al multisig
    C <= balance on-chain de A"]
    C --> D["Transacción fundacional (la anterior) se transmite a la red Bitcoin"]
    D --> E{"¿Blockchain confirma la tx?"}
    E -->|"aún no confirmada, esperar"| E
    E -->|"confirmada"| F["✓ Canal abierto
    Balance A = X sats · Balance B = 0 sats"]
```

---

## Hacer Pagos en Lightning

### Crear Invoice

```mermaid
flowchart TD
    A([Nodo B quiere cobrar]) --> B["Genera un número secreto aleatorio de 32 bytes"]
    B --> C["Calcula el hash del num_secreto
    hash = sha256(num_secreto)"]
    C --> D["Empaqueta todo en formato BOLT-11
    monto + hash + memo + firma + expiración"]
    D --> E["lnbc1p56hf ... xunspegehp4"]
    E --> F["Comparte el invoice a Nodo A
    como string (lnbc1p56hf...) o código QR"]
```

---

### Pagar Invoice

```mermaid
flowchart TD
    A([Nodo A recibe el invoice]) --> B["Escanea o pega el string
    y lo decodifica a texto plano"]
    B --> C{"¿Invoice válido
    y no expirado?"}
    C -->|no| Z["❌ Rechazado
    invoice inválido o expirado"]
    C -->|sí| D["Nodo A crea una nueva Commitment Tx
    con los balances actualizados
    A pierde X sats · B gana X sats"]
    D --> E["Nodo A firma la Commitment Tx
    y envía la copia firmada a Nodo B"]
    E --> F["Nodo B verifica, firma
    y devuelve la copia a Nodo A"]
    F --> G["Ambos guardan la nueva Commitment Tx
    y descartan la anterior"]
    G --> H["✓ Pago completado"]
```

---

## Estado Global del Simulador

```mermaid
stateDiagram-v2
    [*] --> SinNodos

    SinNodos --> ConNodos : Crear nodo

    ConNodos --> CanalPendiente : Abrir canal (tx fundacional enviada a Bitcoin)

    CanalPendiente --> CanalActivo : Bloque minado — canal confirmado

    CanalActivo --> PagandoInvoice : Invoice creado y pagado

    PagandoInvoice --> CanalActivo : Commitment Tx actualizada con nuevos balances

    CanalActivo --> ProblemaLiquidez : Balance de un lado llega a 0

    ProblemaLiquidez --> CanalActivo : Liquidez resuelta

    CanalActivo --> CanalCerrado : Broadcast de Commitment Tx a Bitcoin

    CanalCerrado --> ConNodos : Fondos liquidados y devueltos on-chain
```

---

## Problema de Liquidez

```mermaid
flowchart TD
    A([Nodo A intenta enviar un pago]) --> B{"¿Balance de A en el canal
    es mayor o igual al monto?"}

    B -->|sí| C["✓ Pago procesado con éxito"]

    B -->|no| D["❌ Sin liquidez suficiente para enviar"]
    D --> E{"¿Cómo resolver?"}

    E -->|"Opción 1"| F["Recibir un pago de B primero
    el balance de A en el canal sube"]
    E -->|"Opción 2"| G["Cerrar el canal y abrir uno nuevo
    con más fondos on-chain"]
    E -->|"Opción 3"| H["Pedir a B que abra un canal
    en dirección contraria hacia A"]

    F --> I["✓ Liquidez restaurada"]
    G --> I
    H --> I
    I --> A
```
