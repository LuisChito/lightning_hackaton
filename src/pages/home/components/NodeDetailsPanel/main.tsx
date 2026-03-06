import { Box, Divider, Stack, Typography } from '@mui/material'

const rows = [
  ['Node Type', 'lightning'],
  ['Implementation', 'LND'],
  ['Version', 'v0.20.0-beta'],
  ['Status', 'Started'],
  ['Confirmed Balance', '1,495,918 sats'],
  ['Alias', 'dave'],
  ['Block Height', '235'],
]

function NodeDetailsPanel() {
  return (
    <Box
      sx={{
        height: '100%',
        minHeight: { xs: 180, lg: 0 },
        p: 2,
        borderRadius: 1.5,
        border: '1px solid rgba(128, 165, 235, 0.2)',
        backgroundColor: 'rgba(10, 16, 30, 0.94)',
        overflow: 'auto',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25 }}>
        dave
      </Typography>
      <Typography variant="caption" color="text.secondary">
        1.5M sats
      </Typography>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(128, 165, 235, 0.14)' }} />

      <Stack spacing={1.1}>
        {rows.map(([label, value]) => (
          <Stack key={label} direction="row" justifyContent="space-between" gap={1.5}>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

export default NodeDetailsPanel
