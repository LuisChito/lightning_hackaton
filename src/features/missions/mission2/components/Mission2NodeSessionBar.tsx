import { Box, Chip, Stack, Typography } from '@mui/material'
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
      <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
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
      </Stack>
    </Box>
  )
}

export default NodeSessionBar
