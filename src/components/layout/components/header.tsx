import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import LogoutIcon from '@mui/icons-material/Logout'
import { AppBar, Box, Button, Chip, Container, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useState } from 'react'
import type { MouseEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { lightning, background, border } from '../../../theme/colors'
import { resetGameProgress } from '../../../utils/gameProgress'
import { useGameSounds } from '../../../hooks/useGameSounds'
import { useEffect } from 'react'


const navButtonSx = {
	textTransform: 'none',
	'&.active': {
		color: lightning.dark,
		backgroundColor: lightning.background,
		fontWeight: 600,
	},
}

function Header() {
	const [repoMenuAnchor, setRepoMenuAnchor] = useState<null | HTMLElement>(null)
	const [openResetDialog, setOpenResetDialog] = useState(false)
	const navigate = useNavigate()
	const { playModalClose, playClick, playSpaceEffect, playBubblePop } = useGameSounds()

	// Listener para tecla Espacio cuando el modal está abierto
	useEffect(() => {
		if (!openResetDialog) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				event.preventDefault()
				playSpaceEffect()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [openResetDialog, playSpaceEffect])

	const openRepoMenu = (event: MouseEvent<HTMLElement>) => {
		setRepoMenuAnchor(event.currentTarget)
	}

	const closeRepoMenu = () => {
		setRepoMenuAnchor(null)
	}

	const handleOpenResetDialog = () => {
		playBubblePop()
		setOpenResetDialog(true)
	}

	const handleCloseResetDialog = () => {
		playModalClose()
		setOpenResetDialog(false)
	}

	const handleConfirmReset = () => {
		playClick()
		resetGameProgress()
		setOpenResetDialog(false)
		navigate('/')
	}

	return (
		<AppBar position="static" elevation={0} color="transparent" className="header-bar">
			<Container maxWidth="lg">
				<Toolbar disableGutters className="header-toolbar">
					<Stack direction="row" spacing={1.25} alignItems="center">
						<Box
							component={NavLink}
							to="/game"
							sx={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 1.25,
								textDecoration: 'none',
								color: 'inherit',
							}}
						>
							<Box
								component="img"
								src="/isotipo.png"
							alt="Lightning Game logo"
								sx={{ width: 24, height: 24, objectFit: 'contain' }}
							/>
							<Typography variant="h6" component="h1" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
								Lightning Game
							</Typography>
						</Box>
				</Stack>
					<Button component={NavLink} to="/game" color="inherit" sx={navButtonSx} onClick={playClick}>
						Juego
					</Button>
					<Button component={NavLink} to="/canales" color="inherit" sx={navButtonSx} onClick={playClick}>
						Canales
					</Button>
					<Button component={NavLink} to="/pagos" color="inherit" sx={navButtonSx} onClick={playClick}>
							Pagos
						</Button>					<Button
						color="inherit"
						onClick={handleOpenResetDialog}
						startIcon={<LogoutIcon />}
						sx={{
							textTransform: 'none',
							color: 'error.main',
							'&:hover': {
								backgroundColor: 'error.light',
								color: 'error.dark',
							},
						}}
					>
						Salir
					</Button>						<IconButton color="inherit" aria-label="repositorios" onClick={openRepoMenu}>
							<GitHubIcon />
						</IconButton>
						<Menu
							anchorEl={repoMenuAnchor}
							open={Boolean(repoMenuAnchor)}
							onClose={closeRepoMenu}
							PaperProps={{
								sx: {
									border: `1px solid ${border.medium}`,
									backgroundColor: background.secondary,
								},
							}}
						>
							<MenuItem component="a" href={'https://github.com/LuisChito/client-lightning-quest'} target="_blank" rel="noopener noreferrer" onClick={closeRepoMenu}>
								<Stack direction="row" spacing={1.2} alignItems="center">
									<Typography variant="body2">Frontend</Typography>
									<OpenInNewRoundedIcon fontSize="small" />
								</Stack>
							</MenuItem>
							<MenuItem component="a" href={'https://github.com/LuisChito/client-lightning-quest'} target="_blank" rel="noopener noreferrer" onClick={closeRepoMenu}>
								<Stack direction="row" spacing={1.2} alignItems="center">
									<Typography variant="body2">Backend</Typography>
									<OpenInNewRoundedIcon fontSize="small" />
								</Stack>
							</MenuItem>
						</Menu>
				</Toolbar>
			</Container>

			{/* Diálogo de confirmación para resetear progreso */}
			<Dialog
				open={openResetDialog}
				onClose={handleCloseResetDialog}
				PaperProps={{
					sx: {
						border: `1px solid ${border.medium}`,
						backgroundColor: background.secondary,
						borderRadius: 2,
					},
				}}
			>
				<DialogTitle sx={{ fontWeight: 600 }}>
					¿Salir del juego?
				</DialogTitle>
				<DialogContent>
					<Typography variant="body2" sx={{ mb: 1 }}>
						Se eliminará todo tu progreso:
					</Typography>
					<Stack spacing={0.5} sx={{ ml: 2 }}>
						<Typography variant="body2">• Nodos creados</Typography>
						<Typography variant="body2">• Canales abiertos</Typography>
						<Typography variant="body2">• Progreso del tutorial</Typography>
					</Stack>
					<Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>
						¿Estás seguro de que quieres volver a empezar?
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button onClick={handleCloseResetDialog} variant="outlined">
						Cancelar
					</Button>
					<Button
						onClick={handleConfirmReset}
						variant="contained"
						color="error"
						startIcon={<LogoutIcon />}
					>
						Sí, salir
					</Button>
				</DialogActions>
			</Dialog>
		</AppBar>
	)
}

export default Header
