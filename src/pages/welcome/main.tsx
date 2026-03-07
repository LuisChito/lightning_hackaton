import { Box, Button, Stack, Modal, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { background, lightning, text, border } from '../../theme/colors'
import { loadGameProgress } from '../../utils/gameProgress'
import { useGameSounds } from '../../hooks/useGameSounds'

function WelcomePage() {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [hasSavedSession, setHasSavedSession] = useState(false)
  const { playClick, playModalClose, playBubblePop } = useGameSounds()

  useEffect(() => {
    const savedName = localStorage.getItem('playerName')?.trim() || ''
    const savedProgress = loadGameProgress()
    const canContinue = Boolean(savedName && savedProgress)

    setHasSavedSession(canContinue)
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handleOpenModal = () => {
    playClick()
    if (hasSavedSession) {
      navigate('/game')
      return
    }

    playBubblePop()
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    playModalClose()
    setOpenModal(false)
  }

  const handleStartGame = () => {
    if (playerName.trim()) {
      playClick()
      // Aquí puedes guardar el nombre en un estado global o localStorage
      localStorage.setItem('playerName', playerName.trim())
      navigate('/game')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && playerName.trim()) {
      handleStartGame()
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${background.secondary} 0%, ${background.gradient1} 40%, ${background.gradient3} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Contenido principal con animación de entrada 
      
      
      generame un moockup de 9 imagenes de este personage del bitcoin con diferentes posiciones senaldo cosas en la pantalla, lo vamos a utilizar en nuestra pagina web asi que ponle un fondo diferente para poder sacarle el fondo yo
      
      */}
      <Stack 
        spacing={4} 
        alignItems="center" 
        sx={{ 
          zIndex: 10, 
          position: 'relative',
          animation: 'fadeSlideIn 1s ease-out',
          '@keyframes fadeSlideIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(30px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {/* Logo con animación mejorada */}
        <Box
          sx={{
            position: 'relative',
            animation: 'float-bounce 2.5s ease-in-out infinite',
            '@keyframes float-bounce': {
              '0%, 100%': {
                transform: 'translateY(0px) scale(1) rotate(0deg)',
              },
              '25%': {
                transform: 'translateY(-18px) scale(1.08) rotate(3deg)',
              },
              '50%': {
                transform: 'translateY(-10px) scale(1.03) rotate(-2deg)',
              },
              '75%': {
                transform: 'translateY(-15px) scale(1.05) rotate(2deg)',
              },
            },
          }}
        >
          <Box
            component="img"
            src="/isotipo.png"
            alt="Lightning Game"
            sx={{
              width: { xs: 90, md: 120 },
              height: { xs: 90, md: 120 },
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(245, 158, 11, 0.3))',
              animation: 'rotate-glow 3s ease-in-out infinite',
              '@keyframes rotate-glow': {
                '0%': {
                  filter: 'drop-shadow(0 8px 24px rgba(245, 158, 11, 0.3))',
                },
                '50%': {
                  filter: 'drop-shadow(0 12px 36px rgba(245, 158, 11, 0.5))',
                },
                '100%': {
                  filter: 'drop-shadow(0 8px 24px rgba(245, 158, 11, 0.3))',
                },
              },
            }}
          />
        </Box>

        {/* Título con gradiente animado */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 900,
              background: `linear-gradient(135deg, ${lightning.dark}, ${lightning.primary}, ${lightning.light})`,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              mb: 1,
              animation: 'gradient-slide 3s ease infinite',
              '@keyframes gradient-slide': {
                '0%': {
                  backgroundPosition: '0% 50%',
                },
                '50%': {
                  backgroundPosition: '100% 50%',
                },
                '100%': {
                  backgroundPosition: '0% 50%',
                },
              },
            }}
          >
            LIGHTNING
          </Box>
          <Box
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 700,
              color: text.secondary,
              letterSpacing: '0.2em',
              animation: 'fade-pulse 2s ease-in-out infinite',
              '@keyframes fade-pulse': {
                '0%, 100%': {
                  opacity: 0.7,
                },
                '50%': {
                  opacity: 1,
                },
              },
            }}
          >
            GAME
          </Box>
          <Box
            sx={{
              mt: 1.5,
              fontSize: { xs: '0.85rem', md: '1rem' },
              fontWeight: 600,
              color: text.light,
              letterSpacing: '0.05em',
            }}
          >
            🎮 Juega y Aprende Bitcoin
          </Box>
        </Box>

        {/* Botón START con animación de pulso */}
        <Box sx={{ mt: 2, position: 'relative' }}>
          {/* Anillos pulsantes alrededor del botón */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              border: `3px solid ${lightning.primary}`,
              borderRadius: 2,
              opacity: 0,
              animation: 'ring-pulse 2s ease-out infinite',
              '@keyframes ring-pulse': {
                '0%': {
                  transform: 'translate(-50%, -50%) scale(1)',
                  opacity: 0.6,
                },
                '100%': {
                  transform: 'translate(-50%, -50%) scale(1.3)',
                  opacity: 0,
                },
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleOpenModal}
            sx={{
              px: { xs: 6, md: 10 },
              py: { xs: 2.5, md: 3 },
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 800,
              background: `linear-gradient(180deg, ${lightning.primary} 0%, ${lightning.dark} 100%)`,
              color: '#fff',
              letterSpacing: '0.15em',
              borderRadius: 2,
              border: '3px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
                0 8px 0 0 ${lightning.dark},
                0 8px 24px rgba(217, 119, 6, 0.4)
              `,
              position: 'relative',
              transform: 'translateY(0)',
              transition: 'all 0.2s ease',
              textTransform: 'none',
              animation: 'button-pulse 2s ease-in-out infinite',
              '@keyframes button-pulse': {
                '0%, 100%': {
                  boxShadow: `
                    0 8px 0 0 ${lightning.dark},
                    0 8px 24px rgba(217, 119, 6, 0.4)
                  `,
                },
                '50%': {
                  boxShadow: `
                    0 8px 0 0 ${lightning.dark},
                    0 8px 32px rgba(217, 119, 6, 0.6)
                  `,
                },
              },
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                background: `linear-gradient(180deg, ${lightning.light} 0%, ${lightning.primary} 100%)`,
                boxShadow: `
                  0 11px 0 0 ${lightning.dark},
                  0 11px 32px rgba(217, 119, 6, 0.5)
                `,
                animation: 'none',
              },
              '&:active': {
                transform: 'translateY(4px) scale(0.98)',
                boxShadow: `
                  0 4px 0 0 ${lightning.dark},
                  0 4px 12px rgba(217, 119, 6, 0.4)
                `,
              },
            }}
          >
            {hasSavedSession ? '▶ CONTINUAR' : '▶ START'}
          </Button>
        </Box>

        {/* Badge inferior con animación */}
        <Box
          sx={{
            mt: 2,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: `2px solid ${lightning.borderMedium}`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ fontSize: 20 }}>⚡</Box>
            <Box
              sx={{
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 700,
                color: text.primary,
                letterSpacing: '0.05em',
              }}
            >
              Bitcoin Lightning Network
            </Box>
          </Stack>
        </Box>
      </Stack>

      {/* Modal para ingresar nombre */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${background.secondary}, ${background.gradient1})`,
            borderRadius: 4,
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3)`,
            border: `3px solid ${lightning.borderMedium}`,
            minWidth: { xs: '95%', sm: 500, md: 700 },
            maxWidth: 800,
            outline: 'none',
            overflow: 'hidden',
            animation: 'modalFadeIn 0.3s ease-out',
            '@keyframes modalFadeIn': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.9)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={0}>
            {/* Lado izquierdo - Personaje */}
            <Box
              sx={{
                flex: { xs: 'none', md: 1 },
                background: `linear-gradient(180deg, ${lightning.backgroundLight}, ${background.gradient3})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 3, md: 4 },
                minHeight: { xs: 200, md: 400 },
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src="/bitcoin-character.png"
                alt="Bitcoin Character"
                sx={{
                  width: { xs: '80%', md: '100%' },
                  maxWidth: 280,
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 30px rgba(217, 119, 6, 0.3))',
                }}
              />
              {/* Burbuja de diálogo */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 20, md: 40 },
                  right: { xs: 10, md: -20 },
                  background: '#fff',
                  borderRadius: 3,
                  px: 2.5,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: `2px solid ${lightning.primary}`,
                  maxWidth: 180,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: 30,
                    width: 0,
                    height: 0,
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: `10px solid ${lightning.primary}`,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                    fontWeight: 700,
                    color: lightning.dark,
                    textAlign: 'center',
                  }}
                >
                  ¿Cómo te llamas?
                </Typography>
              </Box>
            </Box>

            {/* Lado derecho - Formulario */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, md: 4 },
                background: background.primary,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Stack spacing={3}>
                {/* Título */}
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      background: `linear-gradient(135deg, ${lightning.dark}, ${lightning.primary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                      fontSize: { xs: '1.75rem', md: '2rem' },
                    }}
                  >
                    ¡Bienvenido!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: text.secondary,
                      fontWeight: 500,
                      lineHeight: 1.6,
                    }}
                  >
                    Antes de comenzar tu aventura en Lightning Network, necesito saber tu nombre.
                  </Typography>
                </Box>

                {/* Input */}
                <TextField
                  autoFocus
                  fullWidth
                  label="Tu nombre"
                  variant="outlined"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ej: Satoshi"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      '&:hover fieldset': {
                        borderColor: lightning.primary,
                        borderWidth: 2,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: lightning.primary,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem',
                      '&.Mui-focused': {
                        color: lightning.primary,
                      },
                    },
                  }}
                />

                {/* Botones */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleCloseModal}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: text.secondary,
                      borderColor: border.medium,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: text.secondary,
                        backgroundColor: background.secondary,
                        borderWidth: 2,
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleStartGame}
                    disabled={!playerName.trim()}
                    sx={{
                      py: 1.5,
                      fontWeight: 800,
                      fontSize: '1rem',
                      background: `linear-gradient(180deg, ${lightning.primary} 0%, ${lightning.dark} 100%)`,
                      color: '#fff',
                      boxShadow: `0 4px 12px rgba(217, 119, 6, 0.3)`,
                      '&:hover': {
                        background: `linear-gradient(180deg, ${lightning.light} 0%, ${lightning.primary} 100%)`,
                        boxShadow: `0 6px 16px rgba(217, 119, 6, 0.4)`,
                      },
                      '&:disabled': {
                        background: background.dark,
                        color: text.light,
                      },
                    }}
                  >
                    Comenzar Juego
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}

export default WelcomePage
