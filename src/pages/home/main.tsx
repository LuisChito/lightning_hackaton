import { Box, Container, Paper, Modal, Typography, Stack, Button, IconButton } from '@mui/material'
import { ReactFlowProvider } from '@xyflow/react'
import { border, background, lightning, text } from '../../theme/colors'
import { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import MapCanvas from '../../components/NetworkMap/MapCanvas'
import AppTopBar from './components/AppTopBar/main'
import CanvasViewportControls from './components/CanvasViewportControls/main'
import NodeDetailsPanel from './components/NodeDetailsPanel/main'
import NodeSessionBar from './components/NodeSessionBar/main'
import LightningNetworkAnimation from '../../components/LightningNetworkAnimation'
import { loadGameProgress, saveGameProgress } from '../../utils/gameProgress'
import { useNetworkStore } from '../../store/useNetworkStore'
import { useGameSounds } from '../../hooks/useGameSounds'

function HomePage() {
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false)
  const [openSecondModal, setOpenSecondModal] = useState(false)
  const [openThirdModal, setOpenThirdModal] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const { selectedNode } = useNetworkStore()
  const { playClick, playModalClose, playSpaceEffect, playBubblePop } = useGameSounds()

  useEffect(() => {
    const name = localStorage.getItem('playerName')
    if (name) {
      setPlayerName(name)
      
      // Verificar si ya completó los modales
      const savedProgress = loadGameProgress()
      if (savedProgress && savedProgress.modalsCompleted) {
        // No mostrar modales si ya los completó
        console.log('Modales ya completados, cargando progreso...')
      } else {
        // Mostrar modales de bienvenida
        playBubblePop()
        setOpenWelcomeModal(true)
      }
    }
  }, [playBubblePop])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        playSpaceEffect()
        if (openWelcomeModal) {
          handleCloseWelcomeModal()
        } else if (openSecondModal) {
          handleCloseSecondModal()
        } else if (openThirdModal) {
          handleCloseThirdModal()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [openWelcomeModal, openSecondModal, openThirdModal, playSpaceEffect])

  const handleCloseWelcomeModal = () => {
    playModalClose()
    setOpenWelcomeModal(false)
    setTimeout(() => {
      playBubblePop()
      setOpenSecondModal(true)
    }, 300)
  }

  const handleCloseSecondModal = () => {
    playModalClose()
    setOpenSecondModal(false)
    setTimeout(() => {
      playBubblePop()
      setOpenThirdModal(true)
    }, 300)
  }

  const handleCloseThirdModal = () => {
    playModalClose()
    setOpenThirdModal(false)
    // Guardar que los modales fueron completados
    saveGameProgress({
      modalsCompleted: true,
    })
  }

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 1, md: 2 },
          height: 'calc(100dvh - 120px)',
          overflow: 'hidden',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1, md: 1.5 },
            height: '100%',
            borderRadius: 2,
            border: `1px solid ${border.primary}`,
            background: `linear-gradient(135deg, ${background.gradient1}, ${background.gradient2})`,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'grid', gap: 1, height: '100%', minHeight: 0, gridTemplateRows: 'auto auto 1fr auto' }}>
            <AppTopBar />
            <NodeSessionBar />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: selectedNode 
                  ? { xs: '1fr 250px', sm: '1fr 280px', lg: '1fr 300px' } 
                  : '1fr',
                gridTemplateRows: '1fr',
                gap: 1,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              <ReactFlowProvider>
                <Box sx={{ position: 'relative', minHeight: 0 }}>
                  <MapCanvas />
                  <CanvasViewportControls />
                </Box>
                <NodeDetailsPanel node={selectedNode} />
              </ReactFlowProvider>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Modal de Bienvenida */}
      <Modal
        open={openWelcomeModal}
        onClose={handleCloseWelcomeModal}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          p: { xs: 2, md: 3 },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 2, md: 3 },
            outline: 'none',
            maxWidth: { xs: '95%', sm: 600, md: 800 },
            animation: 'slideInRight 0.5s ease-out',
            '@keyframes slideInRight': {
              '0%': {
                opacity: 0,
                transform: 'translateX(100px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateX(0)',
              },
            },
          }}
        >
          {/* Imagen del personaje */}
          <Box
            component="img"
            src="/skin2.png"
            alt="Bitcoin Character"
            sx={{
              width: { xs: 200, md: 280 },
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 15px 40px rgba(0, 0, 0, 0.6))',
              flexShrink: 0,
            }}
          />

          {/* Nube de texto */}
          <Box
            sx={{
              position: 'relative',
              background: '#fff',
              borderRadius: 4,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4)`,
              border: `4px solid ${lightning.primary}`,
              p: { xs: 2.5, md: 3.5 },
              maxWidth: { xs: '100%', md: 450 },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: { xs: '50%', md: -30 },
                top: { xs: -20, md: 60 },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: { 
                  xs: '0 20px 20px 20px',
                  md: '20px 30px 20px 0'
                },
                borderColor: { 
                  xs: `transparent transparent ${lightning.primary} transparent`,
                  md: `transparent ${lightning.primary} transparent transparent`
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: { xs: '50%', md: -22 },
                top: { xs: -14, md: 66 },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: { 
                  xs: '0 16px 16px 16px',
                  md: '16px 24px 16px 0'
                },
                borderColor: { 
                  xs: 'transparent transparent #fff transparent',
                  md: 'transparent #fff transparent transparent'
                },
              },
            }}
          >
            {/* Botón cerrar */}
            <IconButton
              onClick={handleCloseWelcomeModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: text.secondary,
                width: 32,
                height: 32,
                '&:hover': {
                  color: lightning.primary,
                  backgroundColor: background.secondary,
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Stack spacing={2}>
              {/* Título de bienvenida */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${lightning.dark}, ${lightning.primary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.4rem', md: '1.65rem' },
                  pr: 3,
                }}
              >
                Bienvenido {playerName} ⚡
              </Typography>

              {/* Mensaje */}
              <Typography
                variant="body1"
                sx={{
                  color: text.primary,
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                En este juego aprenderás cómo funcionan
                los pagos de Bitcoin en Lightning Network.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: text.primary,
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                Tu misión será enviar pagos entre nodos
                utilizando canales con liquidez.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: text.primary,
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700,
                }}
              >
                Pero cuidado...
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: lightning.dark,
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700,
                }}
              >
                No todos los caminos funcionan.
              </Typography>

              {/* Botón Comenzar */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleCloseWelcomeModal}
                sx={{
                  py: 1.5,
                  mt: 1.5,
                  fontWeight: 800,
                  fontSize: '1rem',
                  background: `linear-gradient(180deg, ${lightning.primary} 0%, ${lightning.dark} 100%)`,
                  color: '#fff',
                  boxShadow: `0 4px 12px rgba(217, 119, 6, 0.3)`,
                  '&:hover': {
                    background: `linear-gradient(180deg, ${lightning.light} 0%, ${lightning.primary} 100%)`,
                    boxShadow: `0 6px 16px rgba(217, 119, 6, 0.4)`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                ¡Entendido! (Presiona Espacio)
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>

      {/* Segundo Modal - Nuevo Nodo */}
      <Modal
        open={openSecondModal}
        onClose={handleCloseSecondModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0,
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, lg: 4 },
            width: '100%',
            maxWidth: { xs: '95%', lg: '90vw' },
            outline: 'none',
            p: { xs: 2, md: 3 },
          }}
        >
          {/* Animación de Lightning Network */}
          <Box
            sx={{
              flex: { xs: 'none', lg: 1 },
              width: { xs: '100%', lg: 'auto' },
              maxWidth: { xs: '100%', lg: 600 },
              animation: 'slideInLeft 0.5s ease-out',
              '@keyframes slideInLeft': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(-100px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            <LightningNetworkAnimation />
          </Box>

          {/* Modal con personaje y mensaje */}
          <Box
            sx={{
              flex: { xs: 'none', lg: 1 },
              maxWidth: { xs: '100%', lg: 500 },
              animation: 'slideInRight 0.5s ease-out',
              '@keyframes slideInRight': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(100px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Imagen del personaje */}
              <Box
                component="img"
                src="/skin2.png"
                alt="Bitcoin Character"
                sx={{
                  width: { xs: 180, md: 220 },
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 40px rgba(0, 0, 0, 0.6))',
                  flexShrink: 0,
                }}
              />

              {/* Nube de texto */}
              <Box
                sx={{
                  position: 'relative',
                  background: '#fff',
                  borderRadius: 4,
                  boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4)`,
                  border: `4px solid ${lightning.primary}`,
                  p: { xs: 2.5, md: 3 },
                  width: '100%',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '0 20px 20px 20px',
                    borderColor: `transparent transparent ${lightning.primary} transparent`,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '0 16px 16px 16px',
                    borderColor: 'transparent transparent #fff transparent',
                  },
                }}
              >
                {/* Botón cerrar */}
                <IconButton
                  onClick={handleCloseSecondModal}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: text.secondary,
                    width: 32,
                    height: 32,
                    '&:hover': {
                      color: lightning.primary,
                      backgroundColor: background.secondary,
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                <Stack spacing={2}>
                  {/* Título */}
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        background: `linear-gradient(135deg, ${lightning.dark}, ${lightning.primary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.3rem', md: '1.5rem' },
                        mb: 0.5,
                        pr: 3,
                      }}
                    >
                      ¿Qué es un nodo?
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: text.secondary,
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      Narrativa (texto del juego)
                    </Typography>
                  </Box>

                  {/* Mensaje educativo */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: text.primary,
                      lineHeight: 1.7,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    En la red Lightning, todo comienza con un nodo.
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: text.primary,
                      lineHeight: 1.7,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Cada círculo representa un nodo en la red.
                    Los nodos se conectan entre sí para enviar pagos.
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: text.primary,
                      lineHeight: 1.7,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Piensa en un nodo como una estación
                    por donde puede pasar dinero digital.
                  </Typography>

                  {/* Botón Comenzar */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleCloseSecondModal}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      fontWeight: 800,
                      fontSize: '1rem',
                      background: `linear-gradient(180deg, ${lightning.primary} 0%, ${lightning.dark} 100%)`,
                      color: '#fff',
                      boxShadow: `0 4px 12px rgba(217, 119, 6, 0.3)`,
                      '&:hover': {
                        background: `linear-gradient(180deg, ${lightning.light} 0%, ${lightning.primary} 100%)`,
                        boxShadow: `0 6px 16px rgba(217, 119, 6, 0.4)`,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Continuar (Presiona Espacio)
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Tercer Modal - Transición al jugador */}
      <Modal
        open={openThirdModal}
        onClose={handleCloseThirdModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 3 },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 3, md: 4 },
            outline: 'none',
            maxWidth: { xs: '95%', sm: 700, md: 900 },
            animation: 'fadeInScale 0.5s ease-out',
            '@keyframes fadeInScale': {
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
          {/* Imagen del personaje dorado */}
          <Box
            component="img"
            src="/golden-character.png"
            alt="Golden Bitcoin Character"
            sx={{
              width: { xs: 250, md: 350 },
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 60px rgba(217, 119, 6, 0.8))',
              flexShrink: 0,
            }}
          />

          {/* Nube de texto */}
          <Box
            sx={{
              position: 'relative',
              background: '#fff',
              borderRadius: 4,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4)`,
              border: `4px solid ${lightning.primary}`,
              p: { xs: 3, md: 4 },
              maxWidth: { xs: '100%', md: 500 },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: { xs: '50%', md: -30 },
                top: { xs: -20, md: 80 },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: { 
                  xs: '0 20px 20px 20px',
                  md: '20px 30px 20px 0'
                },
                borderColor: { 
                  xs: `transparent transparent ${lightning.primary} transparent`,
                  md: `transparent ${lightning.primary} transparent transparent`
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: { xs: '50%', md: -22 },
                top: { xs: -14, md: 86 },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: { 
                  xs: '0 16px 16px 16px',
                  md: '16px 24px 16px 0'
                },
                borderColor: { 
                  xs: 'transparent transparent #fff transparent',
                  md: 'transparent #fff transparent transparent'
                },
              },
            }}
          >
            {/* Botón cerrar */}
            <IconButton
              onClick={handleCloseThirdModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: text.secondary,
                width: 32,
                height: 32,
                '&:hover': {
                  color: lightning.primary,
                  backgroundColor: background.secondary,
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Stack spacing={2.5}>
              {/* Título */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${lightning.dark}, ${lightning.primary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  pr: 3,
                }}
              >
                Transición al jugador
              </Typography>

              {/* Mensaje principal */}
              <Typography
                variant="body1"
                sx={{
                  color: text.primary,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Pero ahora la red necesita un nuevo nodo...
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: lightning.dark,
                  lineHeight: 1.8,
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>⚡</span> Ese nodo eres tú.
              </Typography>

              {/* Botón Comenzar */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleCloseThirdModal}
                sx={{
                  py: 1.5,
                  mt: 2,
                  fontWeight: 800,
                  fontSize: '1rem',
                  background: `linear-gradient(180deg, ${lightning.primary} 0%, ${lightning.dark} 100%)`,
                  color: '#fff',
                  boxShadow: `0 4px 12px rgba(217, 119, 6, 0.3)`,
                  '&:hover': {
                    background: `linear-gradient(180deg, ${lightning.light} 0%, ${lightning.primary} 100%)`,
                    boxShadow: `0 6px 16px rgba(217, 119, 6, 0.4)`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                ¡Empecemos! (Presiona Espacio)
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default HomePage
