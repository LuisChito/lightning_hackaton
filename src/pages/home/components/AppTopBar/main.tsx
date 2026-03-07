import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import PersonIcon from '@mui/icons-material/Person'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { Box, Button, Stack, Typography, Chip, Divider } from '@mui/material'
import { border, background, lightning } from '../../../../theme/colors'
import { useState, useEffect } from 'react'

function AppTopBar() {
  const [playerName, setPlayerName] = useState('')
  const [xp] = useState(0)
  const [currentMission] = useState('Misión 1: Primer Pago')

  useEffect(() => {
    const name = localStorage.getItem('playerName')
    if (name) {
      setPlayerName(name)
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
              border: `1px solid ${lightning.borderLight}`,
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
            {currentMission}
          </Typography>
        </Stack>

        {/* Botones de acción */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button size="small" variant="text" startIcon={<AddRoundedIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Create Network
          </Button>
          <Button size="small" variant="text" startIcon={<CollectionsBookmarkRoundedIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Import Network
          </Button>
          <Button size="small" variant="text" startIcon={<ImageRoundedIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Manage Images
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default AppTopBar
