import { Box, Container, Paper, Typography } from '@mui/material'
import { border, background } from '../../theme/colors'

function CanalesPage() {
	return (
		<Container maxWidth="lg">
			<Paper
				elevation={0}
				sx={{
					p: { xs: 2.5, md: 4 },
					borderRadius: 2,
					border: `1px solid ${border.primary}`,
					background: `linear-gradient(135deg, ${background.gradient3}, ${background.gradient4})`,
				}}
			>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
					Canales
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Abre, revisa y monitorea canales entre nodos de forma simple.
				</Typography>
				<Box sx={{ mt: 3, height: 220, borderRadius: 2, backgroundColor: background.overlay }} />
			</Paper>
		</Container>
	)
}

export default CanalesPage
