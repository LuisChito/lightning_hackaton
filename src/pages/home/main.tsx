import { Box, Container, Paper } from '@mui/material'
import MapCanvas from '../../components/NetworkMap/MapCanvas'
import AppFooterStatus from './components/AppFooterStatus/main'
import AppTopBar from './components/AppTopBar/main'
import CanvasViewportControls from './components/CanvasViewportControls/main'
import NodeDetailsPanel from './components/NodeDetailsPanel/main'
import NodeSessionBar from './components/NodeSessionBar/main'

function HomePage() {
  return (
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
          border: '1px solid rgba(128, 165, 235, 0.22)',
          background: 'linear-gradient(135deg, rgba(12, 22, 42, 0.96), rgba(7, 13, 26, 0.98))',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'grid', gap: 1, height: '100%', minHeight: 0, gridTemplateRows: 'auto auto 1fr auto' }}>
          <AppTopBar />
          <NodeSessionBar />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' },
              gridTemplateRows: { xs: '1fr auto', lg: '1fr' },
              gap: 1,
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', minHeight: 0 }}>
              <MapCanvas />
              <CanvasViewportControls />
            </Box>
            <NodeDetailsPanel />
          </Box>

          <AppFooterStatus />
        </Box>
      </Paper>
    </Container>
  )
}

export default HomePage
