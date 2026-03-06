import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import { Box, Button, Stack, Typography } from '@mui/material'

function AppTopBar() {
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
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Polar
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button size="small" variant="text" startIcon={<AddRoundedIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Create Network
          </Button>
          <Button size="small" variant="text" startIcon={<CollectionsBookmarkRoundedIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Import Network
          </Button>
          <Button size="small" variant="text" startIcon={<ImageRoundedIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Manage Images
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default AppTopBar
