import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, IconButton, Stack } from '@mui/material'
import { border, background } from '../../../../theme/colors'

function CanvasViewportControls() {
  return (
    <Box sx={{ position: 'absolute', right: 12, bottom: 12, zIndex: 3 }}>
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small" sx={{ border: `1px solid ${border.primary}`, backgroundColor: background.panelLight }}>
          <SearchRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ border: `1px solid ${border.primary}`, backgroundColor: background.panelLight }}>
          <RemoveRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ border: `1px solid ${border.primary}`, backgroundColor: background.panelLight }}>
          <CenterFocusStrongRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default CanvasViewportControls
