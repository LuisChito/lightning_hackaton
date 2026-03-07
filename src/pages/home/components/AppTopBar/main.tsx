import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import PersonIcon from '@mui/icons-material/Person'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { Box, Button, Stack, Typography, Chip, Divider } from '@mui/material'
import { border, background, lightning } from '../../../../theme/colors'
import { useState, useEffect } from 'react'
import { useMissionStore } from '../../../../store/useMissionStore'
import { loadGameProgress } from '../../../../utils/gameProgress'

function AppTopBar() {
  const [playerName, setPlayerName] = useState('')
  const { xp, currentMission, loadProgress } = useMissionStore()

  useEffect(() => {
    const name = localStorage.getItem('playerName')
    if (name) {
      setPlayerName(name)
    }
    
    // Cargar progreso de misiones
    const savedProgress = loadGameProgress()
    if (savedProgress) {
      loadProgress(savedProgress.xp || 0, savedProgress.completedMissions || [])
    }
  }, [])

  return (
    <Box
      sx={{
        px: 2,
        py: 1.1,
        border: `1px solid ${border.light}`,
        borderRadius: 1.5,
        backgroundColor: background.panel,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
        {/* Información del jugador */}
        <Stack direction="row" alignItems="center" spacing={1.5} divider={<Divider orientation="vertical" flexItem />}>
          <Chip
            icon={<PersonIcon sx={{ fontSize: '1rem' }} />}
            label={playerName || 'Jugador'}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: background.secondary,
              color: lightning.dark,
              border: `1px solid ${lightning.border}`,
            }}
          />
          
          <Chip
            icon={<EmojiEventsIcon sx={{ fontSize: '1rem', color: lightning.primary }} />}
            label={`${xp} XP`}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: background.secondary,
              color: 'text.primary',
              border: `1px solid ${lightning.border}`,
            }}
          />

          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {currentMission?.title || 'Todas las misiones completadas'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default AppTopBar
