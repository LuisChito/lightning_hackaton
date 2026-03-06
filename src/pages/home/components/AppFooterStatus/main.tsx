import { Box, Stack, Typography } from '@mui/material'

function AppFooterStatus() {
  return (
    <Box
      sx={{
        px: 1,
        pt: 0.25,
        display: 'flex',
        justifyContent: 'space-between',
        color: 'text.secondary',
        flexWrap: 'wrap',
        gap: 0.75,
      }}
    >
      <Typography variant="caption">Polar v4.0.0 | Docker v29.2.1 | Compose v2.0.2</Typography>
      <Stack direction="row" spacing={1.25}>
        <Typography variant="caption">Update</Typography>
        <Typography variant="caption">English</Typography>
        <Typography variant="caption">Dark</Typography>
      </Stack>
    </Box>
  )
}

export default AppFooterStatus
