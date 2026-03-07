import { Box, Typography } from '@mui/material'
import {
	addEdge,
	Background,
	BackgroundVariant,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
	useReactFlow,
	type Connection,
	type Edge,
	type EdgeTypes,
	type Node,
	type NodeTypes,
} from '@xyflow/react'
import { useCallback, useState, useEffect } from 'react'
import '@xyflow/react/dist/style.css'
import { background, border, lightning, canvas } from '../../theme/colors'
import ChannelEdge from './ChannelEdge'
import NodeItem from './NodeItem'
import { loadGameProgress, saveGameProgress } from '../../utils/gameProgress'

const nodeTypes: NodeTypes = {
	networkNode: NodeItem,
}

const edgeTypes: EdgeTypes = {
	channelEdge: ChannelEdge,
}

const initialNodes: Node[] = [
	// Nodo central (Hub principal)
	{ id: 'lightning-hub', type: 'networkNode', data: { label: 'LN-Hub', isPlaceholder: true }, position: { x: 400, y: 300 } },
	
	// Nodos conectados al hub (nivel 1)
	{ id: 'alice', type: 'networkNode', data: { label: 'Alice', isPlaceholder: true }, position: { x: 200, y: 150 } },
	{ id: 'bob', type: 'networkNode', data: { label: 'Bob', isPlaceholder: true }, position: { x: 600, y: 150 } },
	{ id: 'carol', type: 'networkNode', data: { label: 'Carol', isPlaceholder: true }, position: { x: 650, y: 450 } },
	{ id: 'dave', type: 'networkNode', data: { label: 'Dave', isPlaceholder: true }, position: { x: 150, y: 450 } },
	
	// Nodos periféricos (nivel 2)
	{ id: 'erin', type: 'networkNode', data: { label: 'Erin', isPlaceholder: true }, position: { x: 50, y: 250 } },
	{ id: 'frank', type: 'networkNode', data: { label: 'Frank', isPlaceholder: true }, position: { x: 750, y: 250 } },
	{ id: 'grace', type: 'networkNode', data: { label: 'Grace', isPlaceholder: true }, position: { x: 400, y: 550 } },
]

const initialEdges: Edge[] = [
	// Conexiones hub central
	{ id: 'hub-alice', source: 'lightning-hub', target: 'alice', type: 'channelEdge' },
	{ id: 'hub-bob', source: 'lightning-hub', target: 'bob', type: 'channelEdge' },
	{ id: 'hub-carol', source: 'lightning-hub', target: 'carol', type: 'channelEdge' },
	{ id: 'hub-dave', source: 'lightning-hub', target: 'dave', type: 'channelEdge' },
	
	// Conexiones periféricas (rutas alternativas)
	{ id: 'alice-erin', source: 'alice', target: 'erin', type: 'channelEdge' },
	{ id: 'bob-frank', source: 'bob', target: 'frank', type: 'channelEdge' },
	{ id: 'carol-grace', source: 'carol', target: 'grace', type: 'channelEdge' },
	{ id: 'dave-grace', source: 'dave', target: 'grace', type: 'channelEdge' },
	
	// Conexiones directas entre usuarios (rutas alternativas sin hub)
	{ id: 'alice-bob', source: 'alice', target: 'bob', type: 'channelEdge' },
	{ id: 'erin-dave', source: 'erin', target: 'dave', type: 'channelEdge' },
]

// Función para obtener nodos iniciales (desde localStorage o por defecto)
const getInitialNodes = (): Node[] => {
	const savedProgress = loadGameProgress()
	if (savedProgress && savedProgress.nodes.length > 0) {
		return savedProgress.nodes
	}
	return initialNodes
}

// Función para obtener edges iniciales (desde localStorage o por defecto)
const getInitialEdges = (): Edge[] => {
	const savedProgress = loadGameProgress()
	if (savedProgress && savedProgress.edges.length > 0) {
		return savedProgress.edges
	}
	return initialEdges
}

// Función para obtener el estado inicial de hasCreatedNode
const getInitialHasCreatedNode = (): boolean => {
	const savedProgress = loadGameProgress()
	return savedProgress?.hasCreatedNode ?? false
}

function MapCanvasInner() {
	const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes())
	const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges())
	const { screenToFlowPosition } = useReactFlow()
	const [hasCreatedNode, setHasCreatedNode] = useState(getInitialHasCreatedNode())

	// Guardar progreso cuando cambien los nodos o edges
	useEffect(() => {
		saveGameProgress({
			nodes,
			edges,
			hasCreatedNode,
		})
	}, [nodes, edges, hasCreatedNode])

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((currentEdges) =>
				addEdge(
					{
						...connection,
						type: 'channelEdge',
					},
					currentEdges,
				),
			)
		},
		[setEdges],
	)

	const onPaneClick = useCallback(
		(event: React.MouseEvent) => {
			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			})

			const newNode: Node = {
				id: `node-${Date.now()}`,
				type: 'networkNode',
				data: { label: `node-1`, isPlaceholder: false },
				position,
			}

			// Si es el primer nodo creado, eliminar los placeholders
			if (!hasCreatedNode) {
				setNodes([newNode])
				setEdges([])
				setHasCreatedNode(true)
			} else {
				setNodes((nds) => {
					const userNodes = nds.filter(n => !n.data?.isPlaceholder)
					const newLabel = `node-${userNodes.length + 1}`
					return [...userNodes, { ...newNode, data: { label: newLabel, isPlaceholder: false } }]
				})
			}
		},
		[screenToFlowPosition, hasCreatedNode, setNodes, setEdges],
	)

	return (
		<>
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
				Network Area
			</Typography>

			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onPaneClick={onPaneClick}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				proOptions={{ hideAttribution: true }}
				defaultEdgeOptions={{ type: 'channelEdge' }}
				connectionLineStyle={{ stroke: lightning.primary, strokeWidth: 2.2 }}
				zoomOnDoubleClick={false}
				selectNodesOnDrag={true}
				panOnDrag={[1, 2]}
				minZoom={0.5}
				maxZoom={2}
			>
				<Background color={canvas.background} gap={38} variant={BackgroundVariant.Lines} />
			</ReactFlow>
		</>
	)
}

function MapCanvas() {
	return (
		<Box
			sx={{
				position: 'relative',
				height: '100%',
				minHeight: { xs: 260, lg: 0 },
				borderRadius: 1.5,
				border: `1px solid ${border.canvas}`,
				backgroundColor: background.dark,
				overflow: 'hidden',
			}}
		>
			<ReactFlowProvider>
				<MapCanvasInner />
			</ReactFlowProvider>
		</Box>
	)
}

export default MapCanvas
