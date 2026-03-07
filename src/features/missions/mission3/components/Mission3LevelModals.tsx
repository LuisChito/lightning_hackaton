import { Box, Typography } from '@mui/material'
import { lightning } from '../../../../theme/colors'

interface Mission3LevelModalsProps {
  showLevel3ReachedModal: boolean
  onCloseLevel3Modal: () => void
}

function Mission3LevelModals({
  showLevel3ReachedModal,
  onCloseLevel3Modal,
}: Mission3LevelModalsProps) {
  if (!showLevel3ReachedModal) {
    return null
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: 30,
        transform: 'translateY(-50%)',
        zIndex: 10,
        maxWidth: 460,
        animation: 'slideInLeft 0.45s ease-out',
        '@keyframes slideInLeft': {
          '0%': {
            transform: 'translateY(-50%) translateX(-100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(-50%) translateX(0)',
            opacity: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: lightning.primary,
            fontWeight: 800,
            mb: 1.5,
            fontSize: '1.15rem',
          }}
        >
          Mision 3 desbloqueada
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(0, 0, 0, 0.87)',
            lineHeight: 1.75,
            mb: 1.2,
          }}
        >
          Alcanzaste 200 XP. Ya puedes pasar a la mision 3.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(0, 0, 0, 0.72)',
            lineHeight: 1.65,
            mb: 2.25,
            fontStyle: 'italic',
          }}
        >
          Objetivo: generar tu primer invoice.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onCloseLevel3Modal}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#f59e0b',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
            }}
          >
            Entendido
          </button>
        </Box>
      </Box>
    </Box>
  )
}

export default Mission3LevelModals
