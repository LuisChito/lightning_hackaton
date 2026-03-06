import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { Box, Typography } from '@mui/material'
import { Handle, Position } from '@xyflow/react'

type NodeItemData = {
	label?: string
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
				border: selected ? '1px solid rgba(240, 180, 41, 0.9)' : '1px solid rgba(128, 165, 235, 0.35)',
				backgroundColor: 'rgba(24, 30, 42, 0.96)',
				px: 1.25,
				py: 0.9,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 1,
			}}
		>
			<Typography variant="body2" sx={{ fontWeight: 700, color: '#e3ecff' }}>
				{data?.label ?? 'node'}
			</Typography>

			<Box
				sx={{
					width: 20,
					height: 20,
					borderRadius: '50%',
					display: 'grid',
					placeItems: 'center',
					backgroundColor: 'rgba(95, 52, 154, 0.82)',
				}}
			>
				<BoltRoundedIcon sx={{ fontSize: 12, color: '#f5e7ff' }} />
			</Box>

			<Handle type="target" position={Position.Left} style={{ background: '#f0b429', width: 8, height: 8 }} />
			<Handle type="source" position={Position.Right} style={{ background: '#f0b429', width: 8, height: 8 }} />
		</Box>
	)
}

export default NodeItem
