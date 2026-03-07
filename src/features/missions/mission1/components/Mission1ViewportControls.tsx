import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, IconButton, Stack } from '@mui/material'
import { useReactFlow } from '@xyflow/react'
import { border, background } from '../../../../theme/colors'

function CanvasViewportControls() {
  const { zoomIn, zoomOut } = useReactFlow()

  const handleFullscreen = async () => {
    const canvasElement = document.getElementById('network-map-canvas')
    if (!canvasElement) return

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await canvasElement.requestFullscreen()
  }

  return (
    <Box sx={{ position: 'absolute', right: 12, bottom: 12, zIndex: 3 }}>
      <Stack direction="row" spacing={0.5}>
        <IconButton
          size="small"
          title="Acercar"
          onClick={() => zoomIn({ duration: 200 })}
          sx={{ border: `1px solid ${border.primary}`, backgroundColor: background.panelLight }}
        >
          <SearchRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          title="Retroceder vista"
          onClick={() => zoomOut({ duration: 200 })}
          sx={{ border: `1px solid ${border.primary}`, backgroundColor: background.panelLight }}
        >
          <RemoveRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          title="Pantalla completa"
          onClick={handleFullscreen}
          sx={{ border: `1px solid ${border.primary}`, backgroundColor: background.panelLight }}
        >
          <CenterFocusStrongRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default CanvasViewportControls
