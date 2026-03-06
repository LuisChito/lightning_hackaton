import { Box, Typography } from '@mui/material'
import {
	Background,
	BackgroundVariant,
	ReactFlow,
	type Edge,
	type EdgeTypes,
	type Node,
	type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ChannelEdge from './ChannelEdge'
import NodeItem from './NodeItem'

const nodeTypes: NodeTypes = {
	networkNode: NodeItem,
}

const edgeTypes: EdgeTypes = {
	channelEdge: ChannelEdge,
}

const nodes: Node[] = []
const edges: Edge[] = []

function MapCanvas() {
	return (
		<Box
			sx={{
				position: 'relative',
				height: '100%',
				minHeight: { xs: 260, lg: 0 },
				borderRadius: 1.5,
				border: '1px solid rgba(43, 66, 111, 0.45)',
				backgroundColor: '#060c17',
				overflow: 'hidden',
			}}
		>
			<Typography
				variant="caption"
				sx={{
					position: 'absolute',
					top: 12,
					left: 12,
					zIndex: 3,
					color: 'text.secondary',
					letterSpacing: 0.4,
					textTransform: 'uppercase',
				}}
			>
				Network Canvas Area
			</Typography>

			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				fitView
				proOptions={{ hideAttribution: true }}
			>
				<Background color="rgba(27, 39, 65, 0.5)" gap={38} variant={BackgroundVariant.Lines} />
			</ReactFlow>
		</Box>
	)
}

export default MapCanvas
