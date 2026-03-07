import { Box, Typography, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import { background, lightning, status } from '../../theme/colors'

interface NodeCreationAnimationProps {
  open: boolean
  onComplete: () => void
}

const steps = [
  { text: 'Inicializando nodo...', delay: 0 },
  { text: 'Conectando a la red...', delay: 800 },
  { text: 'Nodo creado', delay: 1600 },
  { text: 'Tu nodo ahora forma parte de la red Lightning', delay: 2200, isSuccess: true },
]

function NodeCreationAnimation({ open, onComplete }: NodeCreationAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!open) {
      return
    }

    // Reset usando estado previo para evitar cascading renders
    if (currentStep !== 0) {
      setCurrentStep(0)
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    // Mostrar cada paso secuencialmente
    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index)
      }, step.delay)
      timers.push(timer)
    })

    // Cerrar automáticamente después de mostrar el último paso
    const closeTimer = setTimeout(() => {
      onComplete()
    }, 3000)
    timers.push(closeTimer)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onComplete])

  if (!open) return null

  const currentStepData = steps[currentStep]
  const isSuccess = currentStepData?.isSuccess

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 999,
        maxWidth: 380,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: `2px solid ${isSuccess ? status.success : lightning.primary}`,
          background: `linear-gradient(135deg, ${background.gradient1}, ${background.gradient2})`,
          boxShadow: isSuccess 
            ? `0 0 30px ${status.success}20, 0 4px 20px rgba(0, 0, 0, 0.4)`
            : `0 0 20px ${lightning.primary}20, 0 4px 20px rgba(0, 0, 0, 0.4)`,
          animation: 'slideInRight 0.3s ease-out',
          '@keyframes slideInRight': {
            '0%': {
              transform: 'translateX(100%)',
              opacity: 0,
            },
            '100%': {
              transform: 'translateX(0)',
              opacity: 1,
            },
          },
        }}
      >
        {/* Indicador de progreso */}
        <Box
          sx={{
            width: '100%',
            height: 3,
            backgroundColor: background.secondary,
            borderRadius: 2,
            mb: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              height: '100%',
              backgroundColor: isSuccess ? status.success : lightning.primary,
              transition: 'width 0.3s ease',
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Texto del paso actual */}
        <Typography
          variant="body1"
          sx={{
            color: '#fff',
            fontWeight: isSuccess ? 700 : 600,
            fontSize: isSuccess ? '0.95rem' : '0.9rem',
            lineHeight: 1.5,
            animation: 'fadeIn 0.3s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          }}
        >
          {currentStepData?.text}
        </Typography>

        {/* Indicador de carga solo en pasos que no son el final */}
        {!isSuccess && (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              mt: 1.5,
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: lightning.primary,
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 0.3,
                      transform: 'scale(0.8)',
                    },
                    '50%': {
                      opacity: 1,
                      transform: 'scale(1.2)',
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default NodeCreationAnimation
