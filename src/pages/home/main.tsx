import { Box, Container, Paper, Typography } from '@mui/material'

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 2,
          border: '1px solid rgba(128, 165, 235, 0.22)',
          background: 'linear-gradient(135deg, rgba(18, 32, 60, 0.92), rgba(8, 15, 30, 0.96))',
        }}
      >
        <Box
          sx={{
            mt: 3,
            height: { xs: 280, md: 420 },
            borderRadius: 2,
            border: '1px dashed rgba(88, 120, 185, 0.28)',
            backgroundColor: 'rgba(9, 18, 36, 0.9)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Canvas pendiente de implementar
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default HomePage
