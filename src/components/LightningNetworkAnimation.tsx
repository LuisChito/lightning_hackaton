import { motion } from 'framer-motion'
import { Box } from '@mui/material'
import { lightning } from '../theme/colors'

interface Node {
  id: string
  x: number
  y: number
  label: string
}

interface Particle {
  id: number
  initialX: number
  initialY: number
  targetX: number
  targetY: number
  duration: number
  delay: number
}

// Generar partículas una sola vez fuera del componente
const generateParticles = (): Particle[] => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    targetX: Math.random() * 100,
    targetY: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }))
}

const PARTICLES = generateParticles()

const LightningNetworkAnimation = () => {
  const nodes: Node[] = [
    { id: 'A', x: 20, y: 50, label: 'A' },
    { id: 'B', x: 50, y: 30, label: 'B' },
    { id: 'C', x: 80, y: 50, label: 'C' },
  ]

  const connections = [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
  ]

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 200, md: 250 },
        position: 'relative',
        background: 'transparent',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Partículas flotantes */}
      {PARTICLES.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          style={{
            position: 'absolute',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: lightning.primary,
            boxShadow: `0 0 10px ${lightning.primary}`,
          }}
          initial={{
            x: `${particle.initialX}%`,
            y: `${particle.initialY}%`,
            opacity: 0,
          }}
          animate={{
            x: `${particle.targetX}%`,
            y: `${particle.targetY}%`,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* SVG para líneas de conexión diagonales */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connections.map((conn, index) => {
          const fromPos = getNodePosition(conn.from)
          const toPos = getNodePosition(conn.to)
          
          // Coordenadas fijas para las líneas (no siguen los nodos)
          const lineFromX = fromPos.x + 7
          const lineToX = toPos.x + 7
          const lineFromY = fromPos.y + 3
          const lineToY = toPos.y + 3
          
          return (
            <g key={`connection-${index}`}>
              {/* Línea base */}
              <motion.line
                x1={`${lineFromX}%`}
                y1={`${lineFromY}%`}
                x2={`${lineToX}%`}
                y2={`${lineToY}%`}
                stroke={lightning.primary}
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{
                  duration: 1,
                  delay: 0.5 + index * 0.5,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Línea brillante */}
              <motion.line
                x1={`${lineFromX}%`}
                y1={`${lineFromY}%`}
                x2={`${lineToX}%`}
                y2={`${lineToY}%`}
                stroke={lightning.light}
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.5 + index * 0.5,
                  ease: 'easeInOut',
                }}
              />

              {/* Pulso eléctrico viajando */}
              <motion.circle
                r="6"
                fill={lightning.light}
                filter="url(#glow)"
                initial={{
                  cx: `${lineFromX}%`,
                  cy: `${lineFromY}%`,
                  opacity: 0,
                }}
                animate={{
                  cx: [`${lineFromX}%`, `${lineToX}%`],
                  cy: [`${lineFromY}%`, `${lineToY}%`],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 1.5 + index * 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'linear',
                }}
              />
            </g>
          )
        })}
      </svg>

      {/* Nodos */}
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.3,
            type: 'spring',
            stiffness: 200,
          }}
        >
          {/* Nodo principal */}
          <Box
            sx={{
              width: 80,
              height: 50,
              borderRadius: '10px',
              background: '#ffffff',
              border: `3px solid ${lightning.light}`,
              boxShadow: `
                0 0 5px ${lightning.primary},
                inset 0 0 10px rgba(255, 255, 255, 0.1)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.5rem',
              color: '#000',
              textShadow: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>{node.label}</span>
          </Box>

          {/* Texto debajo */}
          <motion.div
            style={{
              position: 'absolute',
              top: 70,
              left: '20%',
              transform: 'translateX(-50%)',
              color: lightning.light,
              fontWeight: 600,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              textShadow: `0 0 10px ${lightning.primary}`,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5 + index * 0.3,
            }}
          >
            Nodo {node.label}
          </motion.div>
        </motion.div>
      ))}
    </Box>
  )
}

export default LightningNetworkAnimation
