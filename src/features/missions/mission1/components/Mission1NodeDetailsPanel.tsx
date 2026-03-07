import { Box, Divider, Stack, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material'
import { border, background, lightning, text } from '../../../../theme/colors'
import type { Node } from '@xyflow/react'
import { useState, useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useMissionStore } from '../../shared/store/useMissionStore'

interface NodeDetailsPanelProps {
  node: Node | null
}

function NodeDetailsPanel({ node }: NodeDetailsPanelProps) {
  // ALWAYS call all hooks first (Rules of Hooks)
  const { setNodes } = useReactFlow()
  const { addXP, completeMission, currentMission } = useMissionStore()
  const [nombre, setNombre] = useState('')
  const [balance, setBalance] = useState(0)
  const [estado, setEstado] = useState<'activo' | 'inactivo'>('activo')
  
  // Estados para rastrear cambios
  const [hasChangedNombre, setHasChangedNombre] = useState(false)
  const [hasChangedBalance, setHasChangedBalance] = useState(false)
  const initialNombreRef = useRef<string>('')
  const initialBalanceRef = useRef<number>(0)

  // Extract node data (safe to access with optional chaining)
  const nodeLabel = (node?.data?.label as string) || 'Unknown'
  const isPlaceholder = node?.data?.isPlaceholder as boolean | undefined

  // Initialize values when node changes
  useEffect(() => {
    // Skip if no node or placeholder
    if (!node || isPlaceholder) return
    
    const nodeData = node.data as { 
      nombre?: string
      balance?: number
      estado?: 'activo' | 'inactivo'
    }
    
    const initialNombre = nodeData?.nombre || nodeLabel
    const initialBalance = nodeData?.balance || 1495918
    
    setNombre(initialNombre)
    setBalance(initialBalance)
    setEstado(nodeData?.estado || 'activo')
    
    // Guardar valores iniciales solo si no se han cambiado aún
    if (!hasChangedNombre) {
      initialNombreRef.current = initialNombre
    }
    if (!hasChangedBalance) {
      initialBalanceRef.current = initialBalance
    }
  }, [node?.id, nodeLabel, isPlaceholder])

  // Early returns AFTER all hooks
  if (!node || isPlaceholder) {
    return null
  }

  // Verificar si es la misión de configurar nodo
  const isConfigureMission = currentMission?.id === 'configure-node'

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

  // Manejar cambio de nombre
  const handleNombreChange = (newNombre: string) => {
    setNombre(newNombre)
    updateNode({ nombre: newNombre })
    
    // Si es la misión de configurar y el nombre cambió del inicial
    if (isConfigureMission && !hasChangedNombre && newNombre !== initialNombreRef.current && newNombre.trim()) {
      addXP(10)
      setHasChangedNombre(true)
      
      // Si ya cambió el balance, completar misión
      if (hasChangedBalance) {
        setTimeout(() => {
          completeMission('configure-node')
        }, 300)
      }
    }
  }

  // Manejar cambio de balance
  const handleBalanceChange = (newBalance: number) => {
    setBalance(newBalance)
    updateNode({ balance: newBalance })
    
    // Si es la misión de configurar y el balance cambió del inicial
    if (isConfigureMission && !hasChangedBalance && newBalance !== initialBalanceRef.current && newBalance > 0) {
      addXP(15)
      setHasChangedBalance(true)
      
      // Si ya cambió el nombre, completar misión
      if (hasChangedNombre) {
        setTimeout(() => {
          completeMission('configure-node')
        }, 300)
      }
    }
  }

  // Formatear balance
  const formatBalance = (sats: number) => {
    return new Intl.NumberFormat('en-US').format(sats)
  }

  // Debug - ver el estado de la misión
  console.log('🎯 Current Mission:', currentMission?.id)
  console.log('✏️ Has Changed Nombre:', hasChangedNombre)
  console.log('💰 Has Changed Balance:', hasChangedBalance)

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
      {/* Banner de Misión Activa */}
      {isConfigureMission && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${lightning.primary}15, ${lightning.dark}15)`,
            border: `2px solid ${lightning.primary}`,
            animation: 'glow 2s ease-in-out infinite',
            '@keyframes glow': {
              '0%, 100%': {
                boxShadow: `0 0 10px ${lightning.primary}40`,
              },
              '50%': {
                boxShadow: `0 0 20px ${lightning.primary}60`,
              },
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: lightning.dark,
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🎯 Misión Activa: Configurar tu Nodo
          </Typography>
          <Typography variant="caption" sx={{ color: text.secondary, display: 'block' }}>
            {!hasChangedNombre && '1. Cambia el nombre (+10 XP) ⚡'}
            {hasChangedNombre && !hasChangedBalance && '2. Ajusta el balance (+15 XP) ⚡'}
            {hasChangedNombre && hasChangedBalance && '✅ ¡Misión completada!'}
          </Typography>
        </Box>
      )}

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25 }}>
          Detalles del Nodo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ID: {node.id}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: border.divider }} />

      {/* Campos editables - Actualización en tiempo real */}
      <Stack spacing={2}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => handleNombreChange(e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
            helperText={
              isConfigureMission && !hasChangedNombre 
                ? '⚡ Cambia este nombre para ganar 10 XP' 
                : ''
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isConfigureMission && !hasChangedNombre ? lightning.primary : undefined,
                  borderWidth: isConfigureMission && !hasChangedNombre ? 2 : 1,
                },
                '&:hover fieldset': {
                  borderColor: isConfigureMission && !hasChangedNombre ? lightning.primary : undefined,
                },
              },
              '& .MuiFormHelperText-root': {
                color: lightning.dark,
                fontWeight: 700,
              },
            }}
          />
          {isConfigureMission && !hasChangedNombre && (
            <Chip
              label="¡Edítame! +10 XP"
              size="small"
              sx={{
                position: 'absolute',
                top: -10,
                right: 8,
                background: `linear-gradient(135deg, ${lightning.primary}, ${lightning.dark})`,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 22,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            />
          )}
        </Box>

        <Box sx={{ position: 'relative' }}>
          <TextField
            label="Balance (sats)"
            type="number"
            value={balance}
            onChange={(e) => handleBalanceChange(Number(e.target.value))}
            size="small"
            fullWidth
            variant="outlined"
            helperText={
              isConfigureMission && !hasChangedBalance 
                ? `⚡ Cambia este balance para ganar 15 XP (actual: ${formatBalance(balance)} satoshis)` 
                : `${formatBalance(balance)} satoshis`
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isConfigureMission && !hasChangedBalance ? lightning.primary : undefined,
                  borderWidth: isConfigureMission && !hasChangedBalance ? 2 : 1,
                },
                '&:hover fieldset': {
                  borderColor: isConfigureMission && !hasChangedBalance ? lightning.primary : undefined,
                },
              },
              '& .MuiFormHelperText-root': {
                color: isConfigureMission && !hasChangedBalance ? lightning.dark : text.secondary,
                fontWeight: isConfigureMission && !hasChangedBalance ? 700 : 400,
              },
            }}
          />
          {isConfigureMission && !hasChangedBalance && (
            <Chip
              label="¡Edítame! +15 XP"
              size="small"
              sx={{
                position: 'absolute',
                top: -10,
                right: 8,
                background: `linear-gradient(135deg, ${lightning.primary}, ${lightning.dark})`,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 22,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            />
          )}
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
    </Box>
  )
}

export default NodeDetailsPanel

