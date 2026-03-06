import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, IconButton, Stack } from '@mui/material'

function CanvasViewportControls() {
  return (
    <Box sx={{ position: 'absolute', right: 12, bottom: 12, zIndex: 3 }}>
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small" sx={{ border: '1px solid rgba(128, 165, 235, 0.22)', backgroundColor: 'rgba(10, 16, 30, 0.95)' }}>
          <SearchRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ border: '1px solid rgba(128, 165, 235, 0.22)', backgroundColor: 'rgba(10, 16, 30, 0.95)' }}>
          <RemoveRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ border: '1px solid rgba(128, 165, 235, 0.22)', backgroundColor: 'rgba(10, 16, 30, 0.95)' }}>
          <CenterFocusStrongRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default CanvasViewportControls
