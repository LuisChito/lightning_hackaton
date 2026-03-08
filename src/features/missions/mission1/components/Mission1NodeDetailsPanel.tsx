import { Box, Divider, Stack, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Modal, Button, IconButton, Tabs, Tab } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { border, background, lightning, text } from '../../../../theme/colors'
import type { Node } from '@xyflow/react'
import { useState, useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useMissionStore } from '../../shared/store/useMissionStore'
import { useGameSounds } from '../../../../hooks/useGameSounds'
import InvoiceTab from '../../../../components/invoices/InvoiceTab'

interface NodeDetailsPanelProps {
  node: Node | null
}

// Tipos para el rol del nodo en pagos
type NodeRole = 'source' | 'target' | 'both' | 'none'

interface ChannelInfo {
  capacity: number
  targetNodeId: string
  sourceNodeId: string
}

function NodeDetailsPanel({ node }: NodeDetailsPanelProps) {
  const { setNodes, getEdges } = useReactFlow()
  const { addXP, missionCounter, xp } = useMissionStore()
  const { playXPGained } = useGameSounds()
  const [nombre, setNombre] = useState('')
  const [balance, setBalance] = useState(0)
  const [estado, setEstado] = useState<'activo' | 'inactivo'>('activo')
  const [hasChangedNombre, setHasChangedNombre] = useState(false)
  const [hasChangedBalance, setHasChangedBalance] = useState(false)
  const [showNameGuideModal, setShowNameGuideModal] = useState(false)
  const [showBalanceGuideModal, setShowBalanceGuideModal] = useState(false)
  const [showAdvanceMissionModal, setShowAdvanceMissionModal] = useState(false)
  const [hasShownAdvanceMissionModal, setHasShownAdvanceMissionModal] = useState(false)
  const initialNombreRef = useRef('')
  const initialBalanceRef = useRef(0)
  
  // Estados para tabs y pagos
  const [activeTab, setActiveTab] = useState(0)
  const [nodeRole, setNodeRole] = useState<NodeRole>('none')
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null)
  const [hasChannels, setHasChannels] = useState(false)

  // Extract node data (safe to access with optional chaining)
  const nodeLabel = (node?.data?.label as string) || 'Unknown'
  const isPlaceholder = node?.data?.isPlaceholder as boolean | undefined
  const isMission1XPActive = missionCounter === 0

  // Detectar canales conectados al nodo
  useEffect(() => {
    if (!node) return
    
    const edges = getEdges()
    const nodeChannels = edges.filter(edge => 
      edge.source === node.id || edge.target === node.id
    )
    
    setHasChannels(nodeChannels.length > 0)
    
    if (nodeChannels.length === 0) {
      setNodeRole('none')
      setChannelInfo(null)
      return
    }
    
    // Determinar el rol del nodo
    const isSource = nodeChannels.some(edge => edge.source === node.id)
    const isTarget = nodeChannels.some(edge => edge.target === node.id)
    
    if (isSource && isTarget) {
      setNodeRole('both')
    } else if (isSource) {
      setNodeRole('source')
    } else if (isTarget) {
      setNodeRole('target')
    }
    
    // Obtener info del canal (tomamos el primer canal por ahora)
    const channel = nodeChannels[0]
    if (channel?.data?.capacity) {
      setChannelInfo({
        capacity: channel.data.capacity as number,
        sourceNodeId: channel.source,
        targetNodeId: channel.target,
      })
    }
  }, [node?.id, getEdges])

  useEffect(() => {
    if (!node || isPlaceholder) return
    
    const nodeData = node.data as { 
      nombre?: string
      balance?: number
      estado?: 'activo' | 'inactivo'
    }
    
    const initialNombre = nodeData?.nombre || nodeLabel
    const initialBalance = nodeData?.balance || 0
    
    setNombre(initialNombre)
    setBalance(initialBalance)
    setEstado(nodeData?.estado || 'activo')
    setHasChangedNombre(false)
    setHasChangedBalance(false)
    setHasShownAdvanceMissionModal(false)
    setShowAdvanceMissionModal(false)
    setShowNameGuideModal(true)
    setShowBalanceGuideModal(false)
    initialNombreRef.current = initialNombre
    initialBalanceRef.current = initialBalance
  }, [node?.id, nodeLabel, isPlaceholder])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return

      if (showNameGuideModal || showBalanceGuideModal) {
        event.preventDefault()
      }

      if (showNameGuideModal) {
        setShowNameGuideModal(false)
        return
      }

      if (showBalanceGuideModal) {
        setShowBalanceGuideModal(false)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [showNameGuideModal, showBalanceGuideModal])

  if (!node || isPlaceholder) {
    return null
  }

  // Actualizar el nodo en tiempo real
  const updateNode = (updates: { nombre?: string; balance?: number; estado?: 'activo' | 'inactivo' }) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          const newData = {
            ...n.data,
            ...updates,
            ...(updates.nombre !== undefined ? { label: updates.nombre } : {}),
          }

          return {
            ...n,
            data: newData,
          }
        }
        return n
      })
    )
  }

  const handleNombreChange = (newNombre: string) => {
    setNombre(newNombre)
    updateNode({ nombre: newNombre })
  }

  const confirmNombreChange = () => {
    const normalizedInitial = initialNombreRef.current.trim()
    const normalizedNew = nombre.trim()
    
    // Solo dar XP la primera vez que cambia el nombre en Mission 1
    if (!hasChangedNombre && normalizedNew.length > 0 && normalizedNew !== normalizedInitial) {
      if (isMission1XPActive) {
        addXP(30)
        playXPGained()
      }
      setHasChangedNombre(true)
      setShowNameGuideModal(false)
      if (!hasChangedBalance) {
        setShowBalanceGuideModal(true)
      }
    }
  }

  const handleBalanceChange = (newBalance: number) => {
    setBalance(newBalance)
    // Actualizar el nodo inmediatamente para que siempre sea editable
    updateNode({ balance: newBalance })
  }

  const confirmBalanceChange = () => {
    const newBalance = balance
    if (!Number.isFinite(newBalance)) {
      return
    }

    const hasRealChange = newBalance > 0 && newBalance !== initialBalanceRef.current
    
    // Solo dar XP la primera vez que cambia el balance en Mission 1
    if (!hasChangedBalance && hasRealChange) {
      if (isMission1XPActive) {
        addXP(30)
        playXPGained()
      }
      setHasChangedBalance(true)
      setShowBalanceGuideModal(false)

      if (hasChangedNombre && !hasShownAdvanceMissionModal) {
        setShowAdvanceMissionModal(true)
        setHasShownAdvanceMissionModal(true)
      }
    }
  }

  // Formatear balance
  const formatBalance = (sats: number) => {
    return new Intl.NumberFormat('en-US').format(sats)
  }

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: { xs: 180, lg: 0 },
        p: 2,
        borderRadius: 1.5,
        border: `1px solid ${border.subtle}`,
        backgroundColor: background.panelLight,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25 }}>
          Detalles del Nodo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ID: {node.id}
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ mt: 1, minHeight: 32, '& .MuiTab-root': { minHeight: 32, py: 0, fontSize: '0.8rem' } }}
        >
          <Tab label="Info" />
          {hasChannels && <Tab label="Pagos" />}
        </Tabs>
      </Box>

      {activeTab === 0 && (
      <>
      <Divider sx={{ borderColor: border.divider }} />

      <Stack spacing={2}>
        <Box>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => handleNombreChange(e.target.value)}
            onBlur={confirmNombreChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmNombreChange()
              }
            }}
            size="small"
            fullWidth
            variant="outlined"
            helperText=""
            sx={{
              '& .MuiOutlinedInput-root': {
                animation: !hasChangedNombre ? 'fieldBreath 1.8s ease-in-out infinite' : 'none',
                '& fieldset': {
                  borderColor: !hasChangedNombre ? border.strong : undefined,
                  borderWidth: !hasChangedNombre ? 2 : 1,
                },
              },
              '@keyframes fieldBreath': {
                '0%, 100%': {
                  boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.12)',
                },
                '50%': {
                  boxShadow: '0 0 0 6px rgba(245, 158, 11, 0.28)',
                },
              },
            }}
          />
        </Box>

        <Box>
          <TextField
            label="Balance (sats)"
            type="number"
            value={balance}
            onChange={(e) => handleBalanceChange(Number(e.target.value))}
            onBlur={confirmBalanceChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmBalanceChange()
              }
            }}
            size="small"
            fullWidth
            variant="outlined"
            helperText={`${formatBalance(balance)} satoshis`}
            sx={{
              '& .MuiOutlinedInput-root': {
                animation: hasChangedNombre && !hasChangedBalance ? 'fieldBreath 1.8s ease-in-out infinite' : 'none',
                '& fieldset': {
                  borderColor: hasChangedNombre && !hasChangedBalance ? border.strong : undefined,
                  borderWidth: hasChangedNombre && !hasChangedBalance ? 2 : 1,
                },
              },
              '@keyframes fieldBreath': {
                '0%, 100%': {
                  boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.12)',
                },
                '50%': {
                  boxShadow: '0 0 0 6px rgba(245, 158, 11, 0.28)',
                },
              },
            }}
          />
        </Box>

        <FormControl size="small" fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={estado}
            label="Estado"
            onChange={(e) => {
              const newEstado = e.target.value as 'activo' | 'inactivo'
              setEstado(newEstado)
              updateNode({ estado: newEstado })
            }}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Modal
        open={showNameGuideModal && !hasChangedNombre}
        onClose={() => setShowNameGuideModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            maxWidth: { xs: '95%', md: 720 },
            outline: 'none',
          }}
        >
          <Box
            component="img"
            src="/bitcoin-derecha.png"
            alt="Guia mision"
            sx={{
              width: { xs: 180, md: 240 },
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.45))',
            }}
          />

          <Box
            sx={{
              position: 'relative',
              background: '#fff',
              borderRadius: 3,
              p: { xs: 2, md: 2.5 },
              border: '3px solid #fbbf24',
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
              maxWidth: 420,
            }}
          >
            <IconButton
              onClick={() => setShowNameGuideModal(false)}
              sx={{ position: 'absolute', top: 6, right: 6 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, pr: 4 }}>
              Paso 1
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Cambia el nombre del nodo para continuar la Mision.
            </Typography>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showBalanceGuideModal && hasChangedNombre && !hasChangedBalance}
        onClose={() => setShowBalanceGuideModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            maxWidth: { xs: '95%', md: 720 },
            outline: 'none',
          }}
        >
          <Box
            component="img"
            src="/bitcoin-derecha.png"
            alt="Guia mision"
            sx={{
              width: { xs: 180, md: 240 },
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.45))',
            }}
          />

          <Box
            sx={{
              position: 'relative',
              background: '#fff',
              borderRadius: 3,
              p: { xs: 2, md: 2.5 },
              border: '3px solid #fbbf24',
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
              maxWidth: 420,
            }}
          >
            <IconButton
              onClick={() => setShowBalanceGuideModal(false)}
              sx={{ position: 'absolute', top: 6, right: 6 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, pr: 4 }}>
              Paso 2
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Muy bien. Ahora cambia el balance en sats para terminar esta parte.
            </Typography>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showAdvanceMissionModal}
        onClose={() => setShowAdvanceMissionModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 520,
            p: 3,
            borderRadius: 2,
            border: `2px solid ${border.strong}`,
            backgroundColor: background.panel,
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            outline: 'none',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Listo
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Ya completaste los pasos de la Mision 1. Puedes avanzar a la Mision 2.
          </Typography>
          <Button variant="contained" onClick={() => setShowAdvanceMissionModal(false)}>
            Continuar
          </Button>
        </Box>
      </Modal>

      <Divider sx={{ borderColor: border.divider }} />

      {/* Información adicional (solo lectura) */}
      <Stack spacing={1.1}>
        <Stack direction="row" justifyContent="space-between" gap={1.5}>
          <Typography variant="caption" color="text.secondary">
            Node Type
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            lightning
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={1.5}>
          <Typography variant="caption" color="text.secondary">
            Implementation
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            LND
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={1.5}>
          <Typography variant="caption" color="text.secondary">
            Version
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            v0.20.0-beta
          </Typography>
        </Stack>
      </Stack>
      </>
      )}

      {activeTab === 1 && hasChannels && (
        <InvoiceTab 
          nodeRole={nodeRole}
          channelCapacity={channelInfo?.capacity || 0}
          isMission3Active={xp >= 200}
        />
      )}
    </Box>
  )
}

export default NodeDetailsPanel

