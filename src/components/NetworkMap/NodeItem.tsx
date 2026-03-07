import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { Box, Typography } from '@mui/material'
import { Handle, Position } from '@xyflow/react'
import { lightning, border, background, text, purple } from '../../theme/colors'

type NodeItemData = {
	label?: string
	isPlaceholder?: boolean
}

type NodeItemProps = {
	data?: NodeItemData
	selected?: boolean
}

function NodeItem({ data, selected }: NodeItemProps) {
	return (
		<Box
			sx={{
				minWidth: 152,
				borderRadius: 1.5,
				border: selected ? `1px solid ${lightning.borderStrong}` : `1px solid ${border.strong}`,
				backgroundColor: background.card,
				px: 1.25,
				py: 0.9,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 1,
				opacity: data?.isPlaceholder ? 0.3 : 1,
				pointerEvents: data?.isPlaceholder ? 'none' : 'auto',
			}}
		>
			<Typography variant="body2" sx={{ fontWeight: 700, color: text.primary }}>
				{data?.label ?? 'node'}
			</Typography>

			<Box
				sx={{
					width: 20,
					height: 20,
					borderRadius: '50%',
					display: 'grid',
					placeItems: 'center',
					backgroundColor: purple.main,
				}}
			>
				<BoltRoundedIcon sx={{ fontSize: 12, color: '#ffffff' }} />
			</Box>

			<Handle type="target" position={Position.Left} style={{ background: lightning.primary, width: 8, height: 8 }} />
			<Handle type="source" position={Position.Right} style={{ background: lightning.primary, width: 8, height: 8 }} />
		</Box>
	)
}

export default NodeItem
