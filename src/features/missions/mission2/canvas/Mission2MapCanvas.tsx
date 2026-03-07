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
import { useCallback, useState, useEffect, useRef } from 'react'
import '@xyflow/react/dist/style.css'
import { background, border, lightning, canvas } from '../../../../theme/colors'
import ChannelEdge from './Mission2ChannelEdge'
import NodeItem from './Mission2NodeItem'
import { loadGameProgress, saveGameProgress } from '../../shared/services/missionProgress.service'
import { useNetworkStore } from '../store/useNetworkStore'
import { useMissionStore } from '../../shared/store/useMissionStore'
import { useGameSounds } from '../../../../hooks/useGameSounds'
import NodeCreationAnimation from '../../../../components/HUD/NodeCreationAnimation'
import ChannelModal from '../../../../components/Controls/ChannelModal'
import Mission3LevelModals from '../../mission3/components/Mission3LevelModals'
import { useMission3Store } from '../../mission3/store/useMission3Store'
import {
	canStartMission3ModalFlow,
	hasSeenMission3ModalFlow,
	markMission3ModalFlowSeen,
} from '../../mission3/canvas/mission3ModalFlow'

const nodeTypes: NodeTypes = {
	networkNode: NodeItem,
}

const edgeTypes: EdgeTypes = {
	channelEdge: ChannelEdge,
}

// Mission 2 inicia sin nodos placeholder - el usuario debe crear sus propios nodos
const initialNodes: Node[] = []

const initialEdges: Edge[] = []

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
	// Si Mission2 tiene progreso propio, usarlo
	if (savedProgress?.mission2 && savedProgress.mission2.nodes.length > 0) {
		return savedProgress.mission2.nodes
	}
	// Si no, heredar los nodos de Mission1 para continuar desde ahí
	if (savedProgress?.mission1 && savedProgress.mission1.nodes.length > 0) {
		return savedProgress.mission1.nodes
	}
	return initialNodes
}

// Función para obtener edges iniciales (desde localStorage o por defecto)
const getInitialEdges = (): Edge[] => {
	const savedProgress = loadGameProgress()
	// Si Mission2 tiene progreso propio, usarlo
	if (savedProgress?.mission2 && savedProgress.mission2.edges.length > 0) {
		return savedProgress.mission2.edges
	}
	// Si no, heredar los edges de Mission1
	if (savedProgress?.mission1 && savedProgress.mission1.edges.length > 0) {
		return savedProgress.mission1.edges
	}
	return initialEdges
}

// Función para obtener el estado inicial de hasCreatedNode
const getInitialHasCreatedNode = (): boolean => {
	const savedProgress = loadGameProgress()
	// Usar el progreso específico de Mission2
	return savedProgress?.mission2?.hasCreatedNode ?? false
}

function MapCanvasInner() {
	const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes())
	const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges())
	const { screenToFlowPosition, getEdges } = useReactFlow()
	const [hasCreatedNode, setHasCreatedNode] = useState(getInitialHasCreatedNode())
	const { setSelectedNode } = useNetworkStore()
	const { completeMission, currentMission, xp, completedMissions } = useMissionStore()
	const [showXPNotification, setShowXPNotification] = useState(false)
	const [earnedXP, setEarnedXP] = useState(0)
	const [xpPosition, setXPPosition] = useState({ x: 0, y: 0 })
	const { playNodeCreated, playNodeInitialization, playMissionComplete, playXPGained } = useGameSounds()
	const previousXPRef = useRef(xp)
	
	// Estado para la animación de creación de nodo
	const [showNodeCreationAnimation, setShowNodeCreationAnimation] = useState(false)
	
	// Estado para mostrar secuencia educativa de canales
	const [showChannelEducation, setShowChannelEducation] = useState(false)
	const [educationStep, setEducationStep] = useState(0)
	
	// Estado para el modal de creación de canal
	const [showChannelModal, setShowChannelModal] = useState(false)
	const [pendingConnection, setPendingConnection] = useState<Connection | null>(null)
	const [modalSourceNode, setModalSourceNode] = useState<{ name: string; balance: number } | null>(null)
	
	// Estado para mostrar hint de click en el nodo
	const [showNodeClickHint, setShowNodeClickHint] = useState(false)
	const [firstNodeId, setFirstNodeId] = useState<string | null>(null)
	const {
		showLevel3ReachedModal,
		showSelectDestinationModal,
		showInvoiceExplanationModal,
		startFlow: startMission3ModalFlow,
		continueToSelectDestination,
		onDestinationSelected,
		closeAll: closeMission3ModalFlow,
	} = useMission3Store()
	
	// Verificar si los modales fueron completados y mostrar hint
	const savedProgress = loadGameProgress()
	const modalsCompleted = savedProgress?.modalsCompleted ?? false
	const hasClickedNode = savedProgress?.mission2?.hasClickedNode ?? false
	// Contar nodos del usuario (excluir placeholders)
	const userNodesCount = nodes.filter(n => !n.data?.isPlaceholder).length
	// Mostrar hint solo si tiene menos de 2 nodos del usuario
	const showDoubleClickHint = modalsCompleted && userNodesCount < 2
	const isCanvasLockedByModal =
		showChannelEducation ||
		showLevel3ReachedModal ||
		showInvoiceExplanationModal ||
		showChannelModal

	// Reproducir sonido cuando sube el XP
	useEffect(() => {
		if (xp > previousXPRef.current && !showXPNotification) {
			const xpGained = xp - previousXPRef.current
			
			// Mostrar notificación visual de XP
			setEarnedXP(xpGained)
			// Posición en el centro de la pantalla
			setXPPosition({ 
				x: window.innerWidth / 2, 
				y: window.innerHeight / 2 
			})
			setShowXPNotification(true)
			
			// Reproducir sonido
			playXPGained()
			
			// Ocultar notificación después de 2 segundos
			setTimeout(() => {
				setShowXPNotification(false)
			}, 2000)
		}
		previousXPRef.current = xp
	}, [xp, playXPGained, showXPNotification])

	// Mostrar flujo de modales de Mission 3 cuando se llega al nivel 3
	useEffect(() => {
		if (!canStartMission3ModalFlow(xp, currentMission?.id)) {
			return
		}

		if (hasSeenMission3ModalFlow()) {
			return
		}

		startMission3ModalFlow()
		markMission3ModalFlowSeen()
	}, [xp, currentMission, startMission3ModalFlow])

	// Guardar progreso cuando cambien los nodos o edges (específico para Mission2)
	useEffect(() => {
		saveGameProgress({
			nodes,
			edges,
			hasCreatedNode,
			completedMissions,
		}, 'mission2')
	}, [nodes, edges, hasCreatedNode, completedMissions])

	const onConnect = useCallback(
		(connection: Connection) => {
			if (isCanvasLockedByModal) {
				return
			}

			if (!connection.source || !connection.target || connection.source === connection.target) {
				return
			}

			const sourceNode = nodes.find((node) => node.id === connection.source)
			const targetNode = nodes.find((node) => node.id === connection.target)
			const sourceIsPlaceholder = Boolean(sourceNode?.data?.isPlaceholder)
			const targetIsPlaceholder = Boolean(targetNode?.data?.isPlaceholder)

			if (!sourceNode || !targetNode || sourceIsPlaceholder || targetIsPlaceholder) {
				return
			}

			const userNodes = nodes.filter((node) => !node.data?.isPlaceholder)
			if (userNodes.length < 2) {
				window.alert('Primero crea el nodo destino para abrir un canal.')
				return
			}

			const sourceBalance = Number((sourceNode.data as { balance?: number } | undefined)?.balance ?? 0)
		const sourceName = (sourceNode.data as { label?: string } | undefined)?.label ?? 'Nodo'
		
		// Abrir modal en lugar de usar window.prompt
		setModalSourceNode({ name: sourceName, balance: sourceBalance })
		setPendingConnection(connection)
		setShowChannelModal(true)
	},
	[nodes, isCanvasLockedByModal],
)

const handleChannelConfirm = useCallback(
  (channelSats: number) => {
    if (!pendingConnection) return

    const currentEdges = getEdges()
    const isFirstChannel = currentEdges.length === 0

    setEdges((currentEdges) => {
      const channelNumber = getNextChannelNumber(currentEdges)
      return addEdge(
        {
          ...pendingConnection,
          id: `channel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: 'channelEdge',
          data: { label: `canal${channelNumber}`, sats: channelSats, capacity: channelSats },
        },
        currentEdges,
      )
    })
    
    // Completar misión y dar +70 XP al crear el primer canal
    if (isFirstChannel && !completedMissions.includes('create-first-channel')) {
      console.log('🎉 Primer canal creado! Completando misión...')
      // Esperar un momento antes de mostrar la siguiente misión
      setTimeout(() => {
        completeMission('create-first-channel')
        playMissionComplete()
      }, 2500)
    }
    
    // Limpiar estados
    setPendingConnection(null)
    setModalSourceNode(null)
  },
  [pendingConnection, setEdges, getEdges, completedMissions, completeMission, playMissionComplete],
)



	const onNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			if (isCanvasLockedByModal) {
				return
			}

			setSelectedNode(node)

			if (showSelectDestinationModal) {
				const isPlaceholder = Boolean(node?.data?.isPlaceholder)
				if (isPlaceholder) {
					return
				}

				const isDestinationNode = edges.some((edge) => edge.target === node.id)
				if (isDestinationNode) {
					onDestinationSelected()
				}
			}
			
			// Ocultar hint si se hace click en el primer nodo creado
			if (showNodeClickHint && node.id === firstNodeId) {
				setShowNodeClickHint(false)
				// Guardar en localStorage que ya se hizo click (específico para Mission2)
				saveGameProgress({
					hasClickedNode: true,
				}, 'mission2')
			}
		},
		[setSelectedNode, showNodeClickHint, firstNodeId, isCanvasLockedByModal, showSelectDestinationModal, edges, onDestinationSelected],
	)

	const onPaneClick = useCallback(
		(event: React.MouseEvent) => {
			if (isCanvasLockedByModal) {
				return
			}

			// Limpiar selección al hacer click en el pane vacío
			setSelectedNode(null)

			if (event.detail < 2) {
				return
			}

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			})

			const nodeNumber = userNodesCount + 1
			const nodeName = `node-${nodeNumber}`

			const newNode: Node = {
				id: `node-${Date.now()}`,
				type: 'networkNode',
				data: { 
					label: nodeName,
					nombre: nodeName,
					// Todos los nodos del jugador arrancan con 100,000 sats
					balance: 100000,
					estado: 'activo' as const,
					isPlaceholder: false 
				},
				position,
			}

			// Si ya tiene nodos del usuario, solo agregar el nuevo nodo (mantener los existentes)
			if (userNodesCount > 0) {
				// Si es el segundo nodo (primer nodo en Mission 2), mostrar animación
				if (userNodesCount === 1 || !hasCreatedNode) {
					// Mostrar animación de creación de nodo
					setShowNodeCreationAnimation(true)
					
					// Reproducir sonido épico de inicialización
					playNodeInitialization()
					
					// Agregar el nodo después de un delay
					setTimeout(() => {
						setNodes((nds) => {
							const userNodes = nds.filter(n => !n.data?.isPlaceholder)
							return [...userNodes, newNode]
						})
					}, 100)
					
					// Mostrar secuencia educativa de canales después de la animación (cuando tenga 2 nodos)
					setTimeout(() => {
						setEducationStep(0)
						setShowChannelEducation(true)
					}, 3200)
				} else {
					// Nodos subsecuentes: solo reproducir sonido simple
					playNodeCreated()
					setNodes((nds) => {
						const userNodes = nds.filter(n => !n.data?.isPlaceholder)
						return [...userNodes, newNode]
					})
				}
				
				// Si es el segundo nodo (Mission 2), marcar que ya creó un nodo en Mission2
				if (!hasCreatedNode) {
					setHasCreatedNode(true)
				}
			} else {
				// Primera vez creando un nodo (no hay nodos del usuario)
				setNodes([newNode])
				setEdges([])
				setHasCreatedNode(true)
				setFirstNodeId(newNode.id)
				
				// Mostrar animación de creación de nodo
				setShowNodeCreationAnimation(true)
				
				// Reproducir sonido épico de inicialización
				playNodeInitialization()
				
				// Completar misión después de la animación
				setTimeout(() => {
					completeMission('create-first-node')
					playMissionComplete()
				}, 2400)
				
				// Mostrar hint para hacer click en el nodo (solo si no se ha clickeado antes)
				if (!hasClickedNode) {
					setTimeout(() => {
						setShowNodeClickHint(true)
					}, 4800)
				}
			}
		},
		[screenToFlowPosition, hasCreatedNode, userNodesCount, setNodes, setEdges, setSelectedNode, nodes, completeMission, playNodeCreated, playNodeInitialization, playMissionComplete, playXPGained, hasClickedNode, isCanvasLockedByModal],
	)

	return (
		<>
			{/* Animación de creación de nodo */}
			<NodeCreationAnimation
				open={showNodeCreationAnimation}
				onComplete={() => setShowNodeCreationAnimation(false)}
			/>

			{/* Modal para creación de canal */}
			{modalSourceNode && (
				<ChannelModal
					open={showChannelModal}
					onClose={() => {
						setShowChannelModal(false)
						setPendingConnection(null)
						setModalSourceNode(null)
					}}
					onConfirm={handleChannelConfirm}
					sourceNodeName={modalSourceNode.name}
					sourceBalance={modalSourceNode.balance}
				/>
			)}

			{/* Secuencia educativa de canales cuando tiene 2 nodos */}
			{showChannelEducation && (
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: 30,
						transform: 'translateY(-50%)',
						zIndex: 10,
						maxWidth: 380,
						animation: 'slideInLeft 0.5s ease-out',
						'@keyframes slideInLeft': {
							'0%': {
								transform: 'translateY(-50%) translateX(-100%)',
								opacity: 0,
							},
							'100%': {
								transform: 'translateY(-50%) translateX(0)',
								opacity: 1,
							},
						},
					}}
				>
					<Box
						sx={{
							p: 3,
							borderRadius: 2,
							backgroundColor: '#ffffff',
							border: '1px solid rgba(0, 0, 0, 0.1)',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
						}}
					>
						{/* Paso 0: Introducción */}
						{educationStep === 0 && (
							<>
								<Typography
									variant="h6"
									sx={{
										color: lightning.primary,
										fontWeight: 700,
										mb: 2,
										fontSize: '1.1rem',
									}}
								>
									Ahora que tienes 2 nodos
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(0, 0, 0, 0.87)',
										lineHeight: 1.8,
										mb: 1.5,
									}}
								>
									Puedes conectarte con otros nodos abriendo canales.
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(0, 0, 0, 0.8)',
										lineHeight: 1.8,
									}}
								>
									Los canales permiten que los pagos viajen entre nodos.
								</Typography>
							</>
						)}

						{/* Paso 1: Explicación de canales con visual */}
						{educationStep === 1 && (
							<>
								<Typography
									variant="h6"
									sx={{
										color: lightning.primary,
										fontWeight: 700,
										mb: 2,
										fontSize: '1.1rem',
									}}
								>
									¿Qué es un canal?
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(0, 0, 0, 0.87)',
										lineHeight: 1.8,
										mb: 2.5,
									}}
								>
									Un canal es un túnel bidireccional entre dos nodos:
								</Typography>
								<Box
									sx={{
										p: 3,
										borderRadius: 2,
										backgroundColor: 'rgba(0, 0, 0, 0.03)',
										border: '1px solid rgba(0, 0, 0, 0.1)',
										mb: 2,
										position: 'relative',
										overflow: 'hidden',
									}}
								>
									{/* Animación de fondo de partículas */}
									<Box
										sx={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											background: `radial-gradient(circle at 50% 50%, ${lightning.primary}10 0%, transparent 70%)`,
											animation: 'pulse 2s ease-in-out infinite',
											'@keyframes pulse': {
												'0%, 100%': { opacity: 0.3 },
												'50%': { opacity: 0.6 },
											},
										}}
									/>

									{/* Visualización de los nodos */}
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											position: 'relative',
											zIndex: 1,
										}}
									>
										{/* Nodo izquierdo (Tu Nodo) */}
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												gap: 1,
											}}
										>
											<Box
												sx={{
													width: 60,
													height: 60,
													borderRadius: '50%',
													background: `linear-gradient(135deg, ${lightning.primary} 0%, ${lightning.secondary} 100%)`,
													boxShadow: `0 0 20px ${lightning.primary}80, 0 0 40px ${lightning.primary}40, inset 0 0 20px rgba(255,255,255,0.2)`,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													animation: 'nodeGlow 2s ease-in-out infinite, float 3s ease-in-out infinite',
													'@keyframes nodeGlow': {
														'0%, 100%': { boxShadow: `0 0 20px ${lightning.primary}80, 0 0 40px ${lightning.primary}40, inset 0 0 20px rgba(255,255,255,0.2)` },
														'50%': { boxShadow: `0 0 30px ${lightning.primary}, 0 0 60px ${lightning.primary}60, inset 0 0 30px rgba(255,255,255,0.3)` },
													},
													'@keyframes float': {
														'0%, 100%': { transform: 'translateY(0px)' },
														'50%': { transform: 'translateY(-8px)' },
													},
												}}
											>
												<Typography
													sx={{
														fontSize: '1.5rem',
														fontWeight: 800,
														color: '#000',
														textShadow: '0 2px 4px rgba(0,0,0,0.3)',
													}}
												>
													A
												</Typography>
											</Box>
											<Typography
												sx={{
													fontSize: '0.75rem',
													color: lightning.primary,
													fontWeight: 700,
													textTransform: 'uppercase',
													letterSpacing: 1,
												}}
											>
												Tu Nodo
											</Typography>
										</Box>

										{/* Canal animado */}
										<Box
											sx={{
												flex: 1,
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												position: 'relative',
												my: 2,
											}}
										>
											{/* Línea del canal con gradiente */}
											<Box
												sx={{
													width: '100%',
													height: 4,
													background: `linear-gradient(90deg, ${lightning.primary} 0%, ${lightning.secondary} 50%, ${lightning.primary} 100%)`,
													borderRadius: 2,
													boxShadow: `0 0 10px ${lightning.primary}60`,
													animation: 'channelPulse 2s ease-in-out infinite',
													'@keyframes channelPulse': {
														'0%, 100%': { opacity: 0.6, transform: 'scaleY(1)' },
														'50%': { opacity: 1, transform: 'scaleY(1.5)' },
													},
												}}
											/>
											
											{/* Partículas viajando */}
											{[0, 1, 2].map((i) => (
												<Box
													key={i}
													sx={{
														position: 'absolute',
														top: '50%',
														left: 0,
														width: 8,
														height: 8,
														borderRadius: '50%',
														backgroundColor: lightning.primary,
														boxShadow: `0 0 10px ${lightning.primary}`,
														animation: `travel${i % 2 === 0 ? 'Right' : 'Left'} ${2 + i * 0.3}s ease-in-out infinite`,
														animationDelay: `${i * 0.6}s`,
														'@keyframes travelRight': {
															'0%': { left: '0%', opacity: 0 },
															'10%': { opacity: 1 },
															'90%': { opacity: 1 },
															'100%': { left: '100%', opacity: 0 },
														},
														'@keyframes travelLeft': {
															'0%': { left: '100%', opacity: 0 },
															'10%': { opacity: 1 },
															'90%': { opacity: 1 },
															'100%': { left: '0%', opacity: 0 },
														},
													}}
												/>
											))}
										</Box>

										{/* Nodo derecho (Nodo B) */}
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												gap: 1,
											}}
										>
											<Box
												sx={{
													width: 60,
													height: 60,
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
													boxShadow: '0 0 20px #667eea80, 0 0 40px #667eea40, inset 0 0 20px rgba(255,255,255,0.2)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													animation: 'nodeGlow2 2s ease-in-out infinite 0.5s, float 3s ease-in-out infinite 1s',
													'@keyframes nodeGlow2': {
														'0%, 100%': { boxShadow: '0 0 20px #667eea80, 0 0 40px #667eea40, inset 0 0 20px rgba(255,255,255,0.2)' },
														'50%': { boxShadow: '0 0 30px #667eea, 0 0 60px #667eea60, inset 0 0 30px rgba(255,255,255,0.3)' },
													},
												}}
											>
												<Typography
													sx={{
														fontSize: '1.5rem',
														fontWeight: 800,
														color: '#fff',
														textShadow: '0 2px 4px rgba(0,0,0,0.3)',
													}}
												>
													B
												</Typography>
											</Box>
											<Typography
												sx={{
													fontSize: '0.75rem',
													color: '#667eea',
													fontWeight: 700,
													textTransform: 'uppercase',
													letterSpacing: 1,
												}}
											>
												Nodo B
											</Typography>
										</Box>
									</Box>
								</Box>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(0, 0, 0, 0.7)',
										lineHeight: 1.6,
										fontSize: '0.85rem',
										textAlign: 'center',
									}}
								>
									Los sats pueden fluir en ambas direcciones a través del canal.
								</Typography>
							</>
						)}

						{/* Paso 2: Concepto de liquidez */}
						{educationStep === 2 && (
							<>
								<Typography
									variant="h6"
									sx={{
										color: lightning.primary,
										fontWeight: 700,
										mb: 2,
										fontSize: '1.1rem',
									}}
								>
									Liquidez en canales
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(0, 0, 0, 0.87)',
										lineHeight: 1.8,
										mb: 2.5,
									}}
								>
									Cuando abres un canal de 500 sats:
								</Typography>
								<Box
									sx={{
										p: 3,
										borderRadius: 2,
										backgroundColor: 'rgba(0, 0, 0, 0.4)',
										border: '1px solid rgba(255, 255, 255, 0.1)',
										mb: 2,
										position: 'relative',
										overflow: 'hidden',
									}}
								>
									{/* Balance labels */}
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											mb: 2,
											position: 'relative',
											zIndex: 1,
										}}
									>
										<Box sx={{ textAlign: 'left' }}>
											<Typography
												sx={{
													fontFamily: 'monospace',
													fontSize: '0.75rem',
													color: 'rgba(255, 255, 255, 0.6)',
													mb: 0.5,
												}}
											>
												Tu Nodo (origen)
											</Typography>
											<Typography
												sx={{
													fontFamily: 'monospace',
													fontSize: '1.3rem',
													color: lightning.primary,
													fontWeight: 700,
													animation: 'countUp 1s ease-out',
													'@keyframes countUp': {
														'0%': { opacity: 0, transform: 'scale(0.5)' },
														'100%': { opacity: 1, transform: 'scale(1)' },
													},
												}}
											>
												500 sats
											</Typography>
										</Box>
										<Typography
											sx={{
												fontSize: '1.5rem',
												color: 'rgba(0, 0, 0, 0.3)',
											}}
										>
											→
										</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography
												sx={{
													fontFamily: 'monospace',
													fontSize: '0.75rem',
													color: 'rgba(255, 255, 255, 0.6)',
													mb: 0.5,
												}}
											>
												Nodo B (destino)
											</Typography>
											<Typography
												sx={{
													fontFamily: 'monospace',
													fontSize: '1.3rem',
													color: 'rgba(0, 0, 0, 0.5)',
													fontWeight: 700,
												}}
											>
												0 sats
											</Typography>
										</Box>
									</Box>

									{/* Barra de liquidez animada */}
									<Box
										sx={{
											position: 'relative',
											height: 40,
											borderRadius: 2,
											overflow: 'hidden',
											backgroundColor: 'rgba(0, 0, 0, 0.05)',
											border: '2px solid rgba(0, 0, 0, 0.1)',
										}}
									>
										{/* Lado de origen (100%) */}
										<Box
											sx={{
												position: 'absolute',
												left: 0,
												top: 0,
												bottom: 0,
												width: '100%',
												background: `linear-gradient(90deg, ${lightning.primary} 0%, ${lightning.secondary} 100%)`,
												animation: 'fillBar 1.5s ease-out',
												'@keyframes fillBar': {
													'0%': { width: '0%' },
													'100%': { width: '100%' },
												},
											}}
										/>
										
										{/* Efecto de brillo móvil */}
										<Box
											sx={{
												position: 'absolute',
												top: 0,
												bottom: 0,
												width: '30%',
												background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
												animation: 'shine 2s ease-in-out infinite',
												'@keyframes shine': {
													'0%': { left: '-30%' },
													'100%': { left: '100%' },
												},
											}}
										/>

										{/* Etiqueta central */}
										<Box
											sx={{
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												zIndex: 2,
											}}
										>
											<Typography
												sx={{
													fontFamily: 'monospace',
													fontSize: '0.85rem',
													fontWeight: 700,
													color: '#000',
													textShadow: '0 0 4px rgba(255,255,255,0.5)',
												}}
											>
												Capacidad: 500 sats
											</Typography>
										</Box>
									</Box>
								</Box>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(255, 255, 255, 0.7)',
										lineHeight: 1.6,
										fontSize: '0.85rem',
									}}
								>
									Toda la liquidez empieza en tu nodo. Puedes enviar hasta 500 sats.
								</Typography>
							</>
						)}

						{/* Paso 3: Prompt para conectar */}
						{educationStep === 3 && (
							<>
								<Typography
									variant="h6"
									sx={{
										color: lightning.primary,
										fontWeight: 700,
										mb: 2,
										fontSize: '1.1rem',
									}}
								>
									¡Listo para conectar!
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(0, 0, 0, 0.87)',
										lineHeight: 1.8,
										mb: 2,
									}}
								>
									Perfecto. Ahora puedes conectar ambos nodos abriendo un canal.
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(0, 0, 0, 0.7)',
										lineHeight: 1.6,
										fontSize: '0.85rem',
										fontStyle: 'italic',
									}}
								>
									Haz clic en uno de tus nodos para empezar.
								</Typography>
							</>
						)}

						{/* Barra de progreso y botón siguiente */}
						<Box sx={{ mt: 3 }}>
							{/* Indicadores de paso */}
							<Box
								sx={{
									display: 'flex',
									gap: 1,
									justifyContent: 'center',
									mb: 2,
								}}
							>
								{[0, 1, 2, 3].map((step) => (
									<Box
										key={step}
										sx={{
											width: 40,
											height: 4,
											borderRadius: 2,
											backgroundColor:
												step === educationStep
													? lightning.primary
													: step < educationStep
													? 'rgba(255, 255, 255, 0.4)'
													: 'rgba(255, 255, 255, 0.15)',
											transition: 'all 0.3s ease',
										}}
									/>
								))}
							</Box>

							{/* Botones de navegación */}
							<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
								{educationStep < 3 ? (
									<button
										onClick={() => setEducationStep(educationStep + 1)}
										style={{
											padding: '10px 24px',
											borderRadius: '8px',
											border: 'none',
											backgroundColor: lightning.primary,
											color: '#000',
											fontWeight: 700,
											fontSize: '0.9rem',
											cursor: 'pointer',
											transition: 'all 0.2s ease',
											boxShadow: `0 4px 12px ${lightning.primary}40`,
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = 'translateY(-2px)';
											e.currentTarget.style.boxShadow = `0 6px 16px ${lightning.primary}60`;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = `0 4px 12px ${lightning.primary}40`;
										}}
									>
										Siguiente
									</button>
								) : (
									<button
										onClick={() => setShowChannelEducation(false)}
										style={{
											padding: '10px 24px',
											borderRadius: '8px',
											border: `2px solid ${lightning.primary}`,
											backgroundColor: 'transparent',
											color: lightning.primary,
											fontWeight: 700,
											fontSize: '0.9rem',
											cursor: 'pointer',
											transition: 'all 0.2s ease',
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = lightning.primary;
											e.currentTarget.style.color = '#000';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = 'transparent';
											e.currentTarget.style.color = lightning.primary;
										}}
									>
										Entendido
									</button>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			)}

			<Mission3LevelModals
				showLevel3ReachedModal={showLevel3ReachedModal}
				showSelectDestinationModal={showSelectDestinationModal}
				showInvoiceExplanationModal={showInvoiceExplanationModal}
				onContinueToSelectDestination={continueToSelectDestination}
				onCloseInvoiceExplanationModal={closeMission3ModalFlow}
			/>

			{/* Bloquea interacción del canvas mientras haya modales abiertos */}
			{isCanvasLockedByModal && (
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						zIndex: 9,
						backgroundColor: 'rgba(0, 0, 0, 0.25)',
						pointerEvents: 'auto',
					}}
				/>
			)}

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
								{userNodesCount === 0 ? 'Haz doble clic aquí para crear tu nodo' : 'Crea otro nodo para abrir un canal'}
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
				zoomOnScroll={!isCanvasLockedByModal}
				zoomOnPinch={!isCanvasLockedByModal}
				selectNodesOnDrag={true}
				nodesDraggable={!isCanvasLockedByModal}
				nodesConnectable={!isCanvasLockedByModal}
				elementsSelectable={!isCanvasLockedByModal}
				panOnDrag={isCanvasLockedByModal ? false : [1, 2]}
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
