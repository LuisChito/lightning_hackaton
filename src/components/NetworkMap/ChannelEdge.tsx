import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from '@xyflow/react'
import { lightning, background } from '../../theme/colors'

function ChannelEdge(props: EdgeProps) {
	const channelLabel = (props.data as { label?: string } | undefined)?.label ?? 'canal'

	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX: props.sourceX,
		sourceY: props.sourceY,
		sourcePosition: props.sourcePosition,
		targetX: props.targetX,
		targetY: props.targetY,
		targetPosition: props.targetPosition,
	})

	return (
		<>
			<BaseEdge path={edgePath} style={{ stroke: lightning.primary, strokeWidth: 2.2 }} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 10,
						fontWeight: 600,
						color: lightning.dark,
						background: background.panel,
						padding: '2px 6px',
						borderRadius: 8,
						border: `1px solid ${lightning.border}`,
						pointerEvents: 'none',
					}}
				>
					{channelLabel}
				</div>
			</EdgeLabelRenderer>
		</>
	)
}

export default ChannelEdge
