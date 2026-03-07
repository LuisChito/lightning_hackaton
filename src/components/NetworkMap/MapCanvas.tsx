import { Box, Typography } from '@mui/material'
import {
	addEdge,
	Background,
	BackgroundVariant,
	ConnectionMode,
	ReactFlow,
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
import { useNetworkStore } from '../../store/useNetworkStore'
import { useMissionStore } from '../../store/useMissionStore'
import { useGameSounds } from '../../hooks/useGameSounds'

const nodeTypes: NodeTypes = {
	networkNode: NodeItem,
}

const edgeTypes: EdgeTypes = {
	channelEdge: ChannelEdge,
}

const initialNodes: Node[] = [
	// Nodo central (Hub principal)
	{ 
		id: 'lightning-hub', 
		type: 'networkNode', 
		data: { 
			label: 'LN-Hub', 
			nombre: 'LN-Hub',
			balance: 5000000,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 400, y: 300 } 
	},
	
	// Nodos conectados al hub (nivel 1)
	{ 
		id: 'alice', 
		type: 'networkNode', 
		data: { 
			label: 'Alice', 
			nombre: 'Alice',
			balance: 2000000,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 200, y: 150 } 
	},
	{ 
		id: 'bob', 
		type: 'networkNode', 
		data: { 
			label: 'Bob', 
			nombre: 'Bob',
			balance: 1500000,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 600, y: 150 } 
	},
	{ 
		id: 'carol', 
		type: 'networkNode', 
		data: { 
			label: 'Carol', 
			nombre: 'Carol',
			balance: 3000000,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 650, y: 450 } 
	},
	{ 
		id: 'dave', 
		type: 'networkNode', 
		data: { 
			label: 'Dave', 
			nombre: 'Dave',
			balance: 1495918,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 150, y: 450 } 
	},
	
	// Nodos periféricos (nivel 2)
	{ 
		id: 'erin', 
		type: 'networkNode', 
		data: { 
			label: 'Erin', 
			nombre: 'Erin',
			balance: 800000,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 50, y: 250 } 
	},
	{ 
		id: 'frank', 
		type: 'networkNode', 
		data: { 
			label: 'Frank', 
			nombre: 'Frank',
			balance: 1200000,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 750, y: 250 } 
	},
	{ 
		id: 'grace', 
		type: 'networkNode', 
		data: { 
			label: 'Grace', 
			nombre: 'Grace',
			balance: 900000,
			estado: 'activo' as const,
			isPlaceholder: true 
		}, 
		position: { x: 400, y: 550 } 
	},
]

const initialEdges: Edge[] = [
	// Conexiones hub central
	{ id: 'hub-alice', source: 'lightning-hub', target: 'alice', type: 'channelEdge', data: { label: 'canal1' } },
	{ id: 'hub-bob', source: 'lightning-hub', target: 'bob', type: 'channelEdge', data: { label: 'canal2' } },
	{ id: 'hub-carol', source: 'lightning-hub', target: 'carol', type: 'channelEdge', data: { label: 'canal3' } },
	{ id: 'hub-dave', source: 'lightning-hub', target: 'dave', type: 'channelEdge', data: { label: 'canal4' } },
	
	// Conexiones periféricas (rutas alternativas)
	{ id: 'alice-erin', source: 'alice', target: 'erin', type: 'channelEdge', data: { label: 'canal5' } },
	{ id: 'bob-frank', source: 'bob', target: 'frank', type: 'channelEdge', data: { label: 'canal6' } },
	{ id: 'carol-grace', source: 'carol', target: 'grace', type: 'channelEdge', data: { label: 'canal7' } },
	{ id: 'dave-grace', source: 'dave', target: 'grace', type: 'channelEdge', data: { label: 'canal8' } },
	
	// Conexiones directas entre usuarios (rutas alternativas sin hub)
	{ id: 'alice-bob', source: 'alice', target: 'bob', type: 'channelEdge', data: { label: 'canal9' } },
	{ id: 'erin-dave', source: 'erin', target: 'dave', type: 'channelEdge', data: { label: 'canal10' } },
]

const getNextChannelNumber = (edges: Edge[]): number => {
	const numbers = edges
		.map((edge) => {
			const label = (edge.data as { label?: string } | undefined)?.label
			const match = typeof label === 'string' ? label.match(/canal\s*(\d+)/i) : null
			return match ? Number.parseInt(match[1], 10) : null
		})
		.filter((n): n is number => n !== null)

	if (numbers.length === 0) {
		return edges.length + 1
	}

	return Math.max(...numbers) + 1
}

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
	const { setSelectedNode } = useNetworkStore()
	const { completeMission, xp, completedMissions } = useMissionStore()
	const [showXPNotification, setShowXPNotification] = useState(false)
	const [earnedXP, setEarnedXP] = useState(0)
	const [xpPosition, setXPPosition] = useState({ x: 0, y: 0 })
	const { playNodeCreated, playMissionComplete, playXPGained } = useGameSounds()
	
	// Estado para mostrar hint de click en el nodo
	const [showNodeClickHint, setShowNodeClickHint] = useState(false)
	const [firstNodeId, setFirstNodeId] = useState<string | null>(null)
	
	// Verificar si los modales fueron completados y mostrar hint
	const savedProgress = loadGameProgress()
	const modalsCompleted = savedProgress?.modalsCompleted ?? false
	const hasClickedNode = savedProgress?.hasClickedNode ?? false
	const showDoubleClickHint = modalsCompleted && !hasCreatedNode

	// Guardar progreso cuando cambien los nodos o edges
	useEffect(() => {
		saveGameProgress({
			nodes,
			edges,
			hasCreatedNode,
			xp,
			completedMissions,
		})
	}, [nodes, edges, hasCreatedNode, xp, completedMissions])

	const onConnect = useCallback(
		(connection: Connection) => {
			if (!connection.source || !connection.target || connection.source === connection.target) {
				return
			}

			setEdges((currentEdges) => {
				const channelNumber = getNextChannelNumber(currentEdges)

				return addEdge(
					{
						...connection,
						id: `channel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
						type: 'channelEdge',
						data: { label: `canal${channelNumber}` },
					},
					currentEdges,
				)
			})
		},
		[setEdges],
	)

	const onNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			setSelectedNode(node)
			
			// Ocultar hint si se hace click en el primer nodo creado
			if (showNodeClickHint && node.id === firstNodeId) {
				setShowNodeClickHint(false)
				// Guardar en localStorage que ya se hizo click
				saveGameProgress({
					hasClickedNode: true,
				})
			}
		},
		[setSelectedNode, showNodeClickHint, firstNodeId],
	)

	const onPaneClick = useCallback(
		(event: React.MouseEvent) => {
			// Limpiar selección al hacer click en el pane vacío
			setSelectedNode(null)

			if (event.detail < 2) {
				return
			}

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			})

			const nodeNumber = hasCreatedNode ? nodes.filter(n => !n.data?.isPlaceholder).length + 1 : 1
			const nodeName = `node-${nodeNumber}`

			const newNode: Node = {
				id: `node-${Date.now()}`,
				type: 'networkNode',
				data: { 
					label: nodeName,
					nombre: nodeName,
					balance: 0,
					estado: 'activo' as const,
					isPlaceholder: false 
				},
				position,
			}

			// Si es el primer nodo creado, eliminar los placeholders
			if (!hasCreatedNode) {
				setNodes([newNode])
				setEdges([])
				setHasCreatedNode(true)
				setFirstNodeId(newNode.id)
				
				// Reproducir sonidos de juego
				playNodeCreated()
				setTimeout(() => playMissionComplete(), 200)
				setTimeout(() => playXPGained(), 400)
				
				// Completar misión y mostrar notificación
				completeMission('create-first-node')
				setEarnedXP(75)
				setXPPosition({ x: event.clientX, y: event.clientY })
				setShowXPNotification(true)
				
				// Ocultar notificación después de 2 segundos
				setTimeout(() => {
					setShowXPNotification(false)
				}, 2000)
				
				// Mostrar hint para hacer click en el nodo (solo si no se ha clickeado antes)
				if (!hasClickedNode) {
					setTimeout(() => {
						setShowNodeClickHint(true)
					}, 2500)
				}
			} else {
				// Reproducir sonido de creación para nodos subsecuentes
				playNodeCreated()
				setNodes((nds) => {
					const userNodes = nds.filter(n => !n.data?.isPlaceholder)
					return [...userNodes, newNode]
				})
			}
		},
		[screenToFlowPosition, hasCreatedNode, setNodes, setEdges, setSelectedNode, nodes, completeMission, playNodeCreated, playMissionComplete, playXPGained, hasClickedNode],
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

			{/* Notificación de XP ganado */}
			{showXPNotification && (
				<Typography
					variant="h4"
					sx={{
						position: 'absolute',
						left: xpPosition.x,
						top: xpPosition.y,
						transform: 'translate(-50%, -50%)',
						zIndex: 20,
						pointerEvents: 'none',
						color: '#ffffff',
						fontWeight: 900,
						fontSize: '2.5rem',
						textShadow: `
							0 0 10px rgba(100, 200, 255, 0.8),
							0 0 20px rgba(100, 200, 255, 0.5),
							0 0 30px rgba(100, 200, 255, 0.3),
							2px 2px 4px rgba(0, 0, 0, 0.9),
							-1px -1px 1px rgba(100, 200, 255, 0.4)
						`,
						animation: 'floatUpXPText 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
						'@keyframes floatUpXPText': {
							'0%': {
								opacity: 0,
								transform: 'translate(-50%, -50%) translateY(0) scale(0.3)',
								filter: 'blur(4px)',
							},
							'15%': {
								opacity: 1,
								transform: 'translate(-50%, -50%) translateY(-10px) scale(1.3)',
								filter: 'blur(0px)',
							},
							'30%': {
								transform: 'translate(-50%, -50%) translateY(-20px) scale(1.1)',
							},
							'100%': {
								opacity: 0,
								transform: 'translate(-50%, -50%) translateY(-120px) scale(0.8)',
								filter: 'blur(2px)',
							},
						},
					}}
				>
					+{earnedXP} XP
				</Typography>
			)}

			{/* Efecto visual para indicar doble clic */}
			{showDoubleClickHint && (
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						zIndex: 10,
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						alignItems: 'center',
						gap: { xs: 2, md: 3 },
						pointerEvents: 'none',
					}}
				>
					{/* Personaje dorado */}
					<Box
						component="img"
						src="/golden-character.png"
						alt="Golden Bitcoin Character"
						sx={{
							width: { xs: 180, md: 250 },
							height: 'auto',
							objectFit: 'contain',
							filter: 'drop-shadow(0 10px 30px rgba(217, 119, 6, 0.6))',
							animation: 'floatCharacter 3s ease-in-out infinite',
							'@keyframes floatCharacter': {
								'0%, 100%': {
									transform: 'translateY(0px)',
								},
								'50%': {
									transform: 'translateY(-15px)',
								},
							},
						}}
					/>

					{/* Contenedor del pulso y texto */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 2,
						}}
					>
						{/* Círculos de pulso animados */}
						<Box sx={{ position: 'relative', width: 120, height: 120 }}>
							{/* Círculo central */}
							<Box
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									width: 60,
									height: 60,
									borderRadius: '50%',
									backgroundColor: lightning.primary,
									boxShadow: `0 0 30px ${lightning.primary}`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									animation: 'pulse 2s ease-in-out infinite',
									'@keyframes pulse': {
										'0%, 100%': {
											transform: 'translate(-50%, -50%) scale(1)',
											opacity: 1,
										},
										'50%': {
											transform: 'translate(-50%, -50%) scale(1.1)',
											opacity: 0.8,
										},
									},
								}}
							>
								<Typography
									sx={{
										color: '#fff',
										fontWeight: 900,
										fontSize: '1.5rem',
									}}
								>
									⚡
								</Typography>
							</Box>
							
							{/* Ripple 1 */}
							<Box
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									width: 60,
									height: 60,
									borderRadius: '50%',
									border: `3px solid ${lightning.primary}`,
									animation: 'ripple 2s ease-out infinite',
									'@keyframes ripple': {
										'0%': {
											width: 60,
											height: 60,
											opacity: 1,
										},
										'100%': {
											width: 120,
											height: 120,
											opacity: 0,
										},
									},
								}}
							/>
							
							{/* Ripple 2 (con delay) */}
							<Box
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									width: 60,
									height: 60,
									borderRadius: '50%',
									border: `3px solid ${lightning.primary}`,
									animation: 'ripple 2s ease-out infinite',
									animationDelay: '1s',
								}}
							/>
						</Box>

						{/* Texto instructivo */}
						<Box
							sx={{
								backgroundColor: 'rgba(0, 0, 0, 0.85)',
								borderRadius: 2,
								px: 3,
								py: 2,
								border: `2px solid ${lightning.primary}`,
								boxShadow: `0 4px 20px rgba(217, 119, 6, 0.4)`,
								animation: 'fadeInUp 0.5s ease-out',
								'@keyframes fadeInUp': {
									'0%': {
										opacity: 0,
										transform: 'translateY(10px)',
									},
									'100%': {
										opacity: 1,
										transform: 'translateY(0)',
									},
								},
							}}
						>
							<Typography
								variant="body1"
								sx={{
									color: '#fff',
									fontWeight: 700,
									textAlign: 'center',
									fontSize: { xs: '0.9rem', md: '1rem' },
								}}
							>
								Haz doble clic aquí para crear tu nodo
							</Typography>
							<Typography
								variant="caption"
								sx={{
									color: lightning.light,
									textAlign: 'center',
									display: 'block',
									mt: 0.5,
									fontSize: { xs: '0.75rem', md: '0.8rem' },
								}}
							>
								👆 Doble clic en cualquier parte del mapa
							</Typography>
						</Box>
					</Box>
				</Box>
			)}

			{/* Hint para hacer click en el nodo creado */}
			{showNodeClickHint && (
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						zIndex: 10,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 2,
						pointerEvents: 'none',
						animation: 'fadeInScale 0.6s ease-out',
						'@keyframes fadeInScale': {
							'0%': {
								opacity: 0,
								transform: 'translate(-50%, -50%) scale(0.8)',
							},
							'100%': {
								opacity: 1,
								transform: 'translate(-50%, -50%) scale(1)',
							},
						},
					}}
				>
					{/* Personaje */}
					<Box
						component="img"
						src="/personaje_saltando.png"
						alt="Character"
						sx={{
							width: { xs: 120, md: 140 },
							height: 'auto',
							objectFit: 'contain',
							filter: 'drop-shadow(0 8px 24px rgba(217, 119, 6, 0.5))',
							animation: 'bounce 1.5s ease-in-out infinite',
							'@keyframes bounce': {
								'0%, 100%': {
									transform: 'translateY(0px)',
								},
								'50%': {
									transform: 'translateY(-10px)',
								},
							},
						}}
					/>

					{/* Texto instructivo */}
					<Box
						sx={{
							backgroundColor: 'rgba(0, 0, 0, 0.9)',
							borderRadius: 2,
							px: 4,
							py: 2.5,
							border: `3px solid ${lightning.primary}`,
							boxShadow: `0 6px 24px rgba(217, 119, 6, 0.5)`,
							maxWidth: { xs: 260, md: 300 },
						}}
					>
						<Typography
							variant="h6"
							sx={{
								color: '#fff',
								fontWeight: 800,
								textAlign: 'center',
								fontSize: { xs: '1.1rem', md: '1.3rem' },
								mb: 1,
							}}
						>
							¡Selecciona tu nodo!
						</Typography>
						<Typography
							variant="body2"
							sx={{
								color: lightning.light,
								textAlign: 'center',
								fontSize: { xs: '0.9rem', md: '1rem' },
								lineHeight: 1.5,
							}}
						>
							👆 Haz click en el nodo que acabas de crear
						</Typography>
					</Box>
				</Box>
			)}

			<ReactFlow
				nodes={nodes}
				edges={edges}
				connectionMode={ConnectionMode.Loose}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeClick={onNodeClick}
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
			id="network-map-canvas"
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
			<MapCanvasInner />
		</Box>
	)
}

export default MapCanvas
