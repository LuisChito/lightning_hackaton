import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from '@xyflow/react'

function ChannelEdge(props: EdgeProps) {
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
			<BaseEdge path={edgePath} style={{ stroke: '#f0b429', strokeWidth: 2.2 }} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 10,
						color: '#f7cd64',
						background: 'rgba(10, 15, 26, 0.9)',
						padding: '2px 6px',
						borderRadius: 8,
						border: '1px solid rgba(240, 180, 41, 0.35)',
						pointerEvents: 'none',
					}}
				>
					channel
				</div>
			</EdgeLabelRenderer>
		</>
	)
}

export default ChannelEdge
