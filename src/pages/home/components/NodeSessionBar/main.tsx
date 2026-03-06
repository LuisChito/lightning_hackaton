import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded'
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined'
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material'

function NodeSessionBar() {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.1,
        border: '1px solid rgba(128, 165, 235, 0.18)',
        borderRadius: 1.5,
        backgroundColor: 'rgba(10, 15, 26, 0.94)',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center">
          <ArrowBackRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            nodoA
          </Typography>
          <Chip
            size="small"
            label="Started"
            variant="outlined"
            sx={{
              height: 20,
              borderColor: 'rgba(119, 213, 104, 0.45)',
              color: '#96e789',
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip size="small" label="height: 235" sx={{ color: 'text.secondary' }} />
          <Chip size="small" icon={<FlashOnRoundedIcon fontSize="small" />} label="Quick Mine" sx={{ color: 'text.secondary' }} />
          <Chip size="small" icon={<AutorenewRoundedIcon fontSize="small" />} label="Auto Mine: Off" sx={{ color: 'text.secondary' }} />
          <IconButton size="small" aria-label="stop" sx={{ color: '#f97b7b' }}>
            <StopCircleOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  )
}

export default NodeSessionBar
