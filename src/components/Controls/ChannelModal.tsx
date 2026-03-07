import { Modal, Box, Typography, TextField } from '@mui/material'
import { useState } from 'react'
import { lightning, background, border } from '../../theme/colors'

interface ChannelModalProps {
	open: boolean
	onClose: () => void
	onConfirm: (amount: number) => void
	sourceNodeName: string
	sourceBalance: number
}

const ChannelModal: React.FC<ChannelModalProps> = ({
	open,
	onClose,
	onConfirm,
	sourceNodeName,
	sourceBalance,
}) => {
	const [amount, setAmount] = useState<string>('')
	const [error, setError] = useState<string>('')

	const handleClose = () => {
		// Reset form on close
		setAmount('')
		setError('')
		onClose()
	}

	const validateAndSubmit = () => {
		const numAmount = parseFloat(amount)

		if (!amount || isNaN(numAmount)) {
			setError('Por favor ingresa una cantidad válida')
			return
		}

		if (numAmount <= 0) {
			setError('La cantidad debe ser mayor a 0')
			return
		}

		if (numAmount > sourceBalance) {
			setError('Saldo insuficiente en el nodo origen')
			return
		}

		// Success - call confirm callback
		onConfirm(numAmount)
		handleClose()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			validateAndSubmit()
		} else if (e.key === 'Escape') {
			handleClose()
		}
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value)
		if (error) setError('') // Clear error on input change
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="channel-modal-title"
			aria-describedby="channel-modal-description"
		>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 450,
					bgcolor: background.card,
					border: `2px solid ${lightning.primary}`,
					boxShadow: `0 0 30px ${lightning.primary}40`,
					borderRadius: 2,
					p: 4,
					outline: 'none',
					animation: 'modalFadeIn 0.3s ease-out',
					'@keyframes modalFadeIn': {
						from: {
							opacity: 0,
							transform: 'translate(-50%, -55%)',
						},
						to: {
							opacity: 1,
							transform: 'translate(-50%, -50%)',
						},
					},
				}}
			>
				{/* Header */}
				<Typography
					id="channel-modal-title"
					variant="h5"
					component="h2"
					sx={{
						mb: 3,
						fontWeight: 700,
						color: lightning.primary,
						textAlign: 'center',
						textShadow: `0 0 10px ${lightning.primary}80`,
					}}
				>
					⚡ Abrir Canal de Pago
				</Typography>

				{/* Source Node Info */}
				<Box
					sx={{
						mb: 3,
						p: 2,
						bgcolor: background.secondary,
						border: `1px solid ${border.medium}`,
						borderRadius: 1,
					}}
				>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
						Nodo Origen:
					</Typography>
					<Typography variant="h6" sx={{ fontWeight: 600, color: lightning.primary }}>
						{sourceNodeName}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						Balance disponible:{' '}
						<Box
							component="span"
							sx={{
								fontWeight: 600,
								color: lightning.light,
								fontFamily: 'monospace',
								fontSize: '1.1em',
							}}
						>
							{sourceBalance.toLocaleString()} sats
						</Box>
					</Typography>
				</Box>

				{/* Amount Input */}
				<Box sx={{ mb: 3 }}>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
						Capacidad del Canal (en satoshis):
					</Typography>
					<TextField
						fullWidth
						type="number"
						value={amount}
						onChange={handleAmountChange}
						onKeyDown={handleKeyDown}
						placeholder="Ejemplo: 500"
						autoFocus
						error={!!error}
						helperText={error || 'Esta será la capacidad máxima del canal'}
						sx={{
							'& .MuiOutlinedInput-root': {
								fontFamily: 'monospace',
								fontSize: '1.2em',
								'& fieldset': {
								borderColor: error ? undefined : border.medium,
								},
								'&:hover fieldset': {
									borderColor: error ? undefined : lightning.primary,
								},
								'&.Mui-focused fieldset': {
									borderColor: error ? undefined : lightning.primary,
									boxShadow: error ? undefined : `0 0 8px ${lightning.primary}40`,
								},
							},
						}}
						InputProps={{
							endAdornment: (
								<Typography
									variant="body2"
									sx={{
										color: 'text.secondary',
										fontWeight: 600,
										ml: 1,
									}}
								>
									sats
								</Typography>
							),
						}}
					/>
				</Box>

				{/* Info Box */}
				<Box
					sx={{
						mb: 3,
						p: 2,
						bgcolor: `${lightning.primary}10`,
						border: `1px solid ${lightning.primary}30`,
						borderRadius: 1,
					}}
				>
					<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875em' }}>
						💡 <strong>Nota:</strong> La cantidad ingresada será bloqueada en el canal y no estará
						disponible en tu balance hasta que cierres el canal.
					</Typography>
				</Box>

				{/* Action Buttons */}
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Box
						component="button"
						onClick={handleClose}
						sx={{
							flex: 1,
							py: 1.5,
							px: 3,
							bgcolor: background.secondary,
							border: `2px solid ${border.medium}`,
							borderRadius: 1,
							color: 'text.primary',
							fontSize: '1rem',
							fontWeight: 600,
							cursor: 'pointer',
							transition: 'all 0.2s',
							'&:hover': {
								bgcolor: border.light,
								transform: 'translateY(-1px)',
							},
							'&:active': {
								transform: 'translateY(0)',
							},
						}}
					>
						Cancelar
					</Box>
					<Box
						component="button"
						onClick={validateAndSubmit}
						sx={{
							flex: 1,
							py: 1.5,
							px: 3,
							background: `linear-gradient(135deg, ${lightning.primary} 0%, ${lightning.light} 100%)`,
							border: 'none',
							borderRadius: 1,
							color: '#000',
							fontSize: '1rem',
							fontWeight: 700,
							cursor: 'pointer',
							transition: 'all 0.2s',
							boxShadow: `0 4px 12px ${lightning.primary}40`,
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: `0 6px 16px ${lightning.primary}60`,
							},
							'&:active': {
								transform: 'translateY(0)',
							},
						}}
					>
						⚡ Abrir Canal
					</Box>
				</Box>

				{/* Keyboard Hints */}
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{
						display: 'block',
						textAlign: 'center',
						mt: 2,
						fontSize: '0.75em',
					}}
				>
					Presiona <strong>Enter</strong> para confirmar o <strong>Esc</strong> para cancelar
				</Typography>
			</Box>
		</Modal>
	)
}

export default ChannelModal
