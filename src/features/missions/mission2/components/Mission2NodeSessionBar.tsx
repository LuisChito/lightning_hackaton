import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded'
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined'
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material'
import { border, background, status } from '../../../../theme/colors'

function NodeSessionBar() {
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Node Session
          </Typography>
          <Chip
            size="small"
            label="Started"
            variant="outlined"
            sx={{
              height: 20,
              borderColor: status.successBorder,
              color: status.success,
              backgroundColor: status.successBg,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 'fit-content' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Progreso
            </Typography>
            <Box
              sx={{
          width: 120,
          height: 8,
          borderRadius: 4,
          backgroundColor: background.secondary,
          border: `1px solid ${border.subtle}`,
          overflow: 'hidden',
          position: 'relative',
              }}
            >
              <Box
          sx={{
            height: '100%',
            width: `${((localStorage.getItem('xp') ? parseInt(localStorage.getItem('xp') as string) : 0) % 100)}%`,
            backgroundColor: status.success,
            transition: 'width 0.3s ease',
            borderRadius: 4,
          }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, minWidth: '30px' }}>
              {((localStorage.getItem('xp') ? parseInt(localStorage.getItem('xp') as string) : 0) % 100)}%
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

export default NodeSessionBar
