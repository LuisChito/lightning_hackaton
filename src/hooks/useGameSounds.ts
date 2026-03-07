import { useCallback, useRef } from 'react'

/**
 * Hook personalizado para efectos de sonido del juego
 * Usa Web Audio API para generar sonidos sintéticos profesionales
 */
export const useGameSounds = () => {
	const audioContextRef = useRef<AudioContext | null>(null)
	const backgroundMusicNodesRef = useRef<{ oscillators: OscillatorNode[], gains: GainNode[] }>({ oscillators: [], gains: [] })
	const isMusicPlayingRef = useRef(false)

	// Inicializar AudioContext solo cuando se necesite (lazy initialization)
	const getAudioContext = useCallback(() => {
		if (!audioContextRef.current) {
			// @ts-expect-error - webkitAudioContext es una API legacy de Safari
			audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
		}
		return audioContextRef.current
	}, [])

	/**
	 * Sonido de creación de nodo - Tono futurista ascendente
	 */
	const playNodeCreated = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		// Oscilador principal
		const osc = ctx.createOscillator()
		const gain = ctx.createGain()

		osc.type = 'sine'
		osc.frequency.setValueAtTime(300, now)
		osc.frequency.exponentialRampToValueAtTime(600, now + 0.15)

		gain.gain.setValueAtTime(0.3, now)
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

		osc.connect(gain)
		gain.connect(ctx.destination)

		osc.start(now)
		osc.stop(now + 0.2)

		// Segundo oscilador para armonía
		const osc2 = ctx.createOscillator()
		const gain2 = ctx.createGain()

		osc2.type = 'triangle'
		osc2.frequency.setValueAtTime(450, now)
		osc2.frequency.exponentialRampToValueAtTime(900, now + 0.15)

		gain2.gain.setValueAtTime(0.15, now)
		gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

		osc2.connect(gain2)
		gain2.connect(ctx.destination)

		osc2.start(now)
		osc2.stop(now + 0.2)
	}, [getAudioContext])

	/**
	 * Sonido épico de inicialización de nodo - Secuencia completa para animación
	 */
	const playNodeInitialization = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		// Fase 1: Inicializando (0-0.8s) - Tono de carga ascendente
		const phase1Osc = ctx.createOscillator()
		const phase1Gain = ctx.createGain()
		phase1Osc.type = 'sawtooth'
		phase1Osc.frequency.setValueAtTime(150, now)
		phase1Osc.frequency.linearRampToValueAtTime(300, now + 0.7)
		phase1Gain.gain.setValueAtTime(0, now)
		phase1Gain.gain.linearRampToValueAtTime(0.15, now + 0.1)
		phase1Gain.gain.linearRampToValueAtTime(0.1, now + 0.7)
		phase1Osc.connect(phase1Gain)
		phase1Gain.connect(ctx.destination)
		phase1Osc.start(now)
		phase1Osc.stop(now + 0.8)

		// Fase 2: Conectando (0.8-1.6s) - Pulsos rítmicos
		for (let i = 0; i < 4; i++) {
			const pulseOsc = ctx.createOscillator()
			const pulseGain = ctx.createGain()
			const startTime = now + 0.8 + (i * 0.2)
			
			pulseOsc.type = 'sine'
			pulseOsc.frequency.setValueAtTime(400 + (i * 50), startTime)
			pulseGain.gain.setValueAtTime(0.2, startTime)
			pulseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
			
			pulseOsc.connect(pulseGain)
			pulseGain.connect(ctx.destination)
			pulseOsc.start(startTime)
			pulseOsc.stop(startTime + 0.15)
		}

		// Fase 3: Nodo creado (1.6-2.2s) - Acorde brillante ascendente
		const successNotes = [523.25, 659.25, 783.99] // C-E-G
		successNotes.forEach((freq, index) => {
			const noteOsc = ctx.createOscillator()
			const noteGain = ctx.createGain()
			const startTime = now + 1.6 + (index * 0.08)
			
			noteOsc.type = 'triangle'
			noteOsc.frequency.setValueAtTime(freq, startTime)
			noteGain.gain.setValueAtTime(0.2, startTime)
			noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)
			
			noteOsc.connect(noteGain)
			noteGain.connect(ctx.destination)
			noteOsc.start(startTime)
			noteOsc.stop(startTime + 0.4)
		})

		// Fase 4: Efecto final brillante (2.2s) - Shimmer
		const shimmerOsc = ctx.createOscillator()
		const shimmerGain = ctx.createGain()
		shimmerOsc.type = 'sine'
		shimmerOsc.frequency.setValueAtTime(1500, now + 2.2)
		shimmerOsc.frequency.exponentialRampToValueAtTime(3000, now + 2.6)
		shimmerGain.gain.setValueAtTime(0.15, now + 2.2)
		shimmerGain.gain.exponentialRampToValueAtTime(0.01, now + 2.8)
		shimmerOsc.connect(shimmerGain)
		shimmerGain.connect(ctx.destination)
		shimmerOsc.start(now + 2.2)
		shimmerOsc.stop(now + 2.8)
	}, [getAudioContext])

	/**
	 * Sonido de misión completada - Fanfarria épica
	 */
	const playMissionComplete = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		// Secuencia de notas triunfales
		const notes = [
			{ freq: 523.25, time: 0, duration: 0.12 },     // C
			{ freq: 659.25, time: 0.1, duration: 0.12 },   // E
			{ freq: 783.99, time: 0.2, duration: 0.25 },   // G
			{ freq: 1046.50, time: 0.35, duration: 0.35 }, // C alta
		]

		notes.forEach(note => {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()

			osc.type = 'square'
			osc.frequency.setValueAtTime(note.freq, now + note.time)

			gain.gain.setValueAtTime(0.2, now + note.time)
			gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)

			osc.connect(gain)
			gain.connect(ctx.destination)

			osc.start(now + note.time)
			osc.stop(now + note.time + note.duration)
		})

		// Efecto de brillo/shimmer al final
		const shimmer = ctx.createOscillator()
		const shimmerGain = ctx.createGain()

		shimmer.type = 'sine'
		shimmer.frequency.setValueAtTime(2000, now + 0.4)
		shimmer.frequency.exponentialRampToValueAtTime(3000, now + 0.7)

		shimmerGain.gain.setValueAtTime(0.1, now + 0.4)
		shimmerGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7)

		shimmer.connect(shimmerGain)
		shimmerGain.connect(ctx.destination)

		shimmer.start(now + 0.4)
		shimmer.stop(now + 0.7)
	}, [getAudioContext])

	/**
	 * Sonido de XP ganado - Colección de moneda/energía
	 */
	const playXPGained = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		// Sonido brillante de colección
		const osc = ctx.createOscillator()
		const gain = ctx.createGain()

		osc.type = 'sine'
		osc.frequency.setValueAtTime(800, now)
		osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08)

		gain.gain.setValueAtTime(0.25, now)
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

		osc.connect(gain)
		gain.connect(ctx.destination)

		osc.start(now)
		osc.stop(now + 0.15)

		// Segundo tono para profundidad
		const osc2 = ctx.createOscillator()
		const gain2 = ctx.createGain()

		osc2.type = 'triangle'
		osc2.frequency.setValueAtTime(1200, now + 0.05)
		osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.12)

		gain2.gain.setValueAtTime(0.15, now + 0.05)
		gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.18)

		osc2.connect(gain2)
		gain2.connect(ctx.destination)

		osc2.start(now + 0.05)
		osc2.stop(now + 0.18)
	}, [getAudioContext])

	/**
	 * Sonido de modal abierto - UI positivo
	 */
	const playModalOpen = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		const osc = ctx.createOscillator()
		const gain = ctx.createGain()

		osc.type = 'sine'
		osc.frequency.setValueAtTime(400, now)
		osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)

		gain.gain.setValueAtTime(0.2, now)
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)

		osc.connect(gain)
		gain.connect(ctx.destination)

		osc.start(now)
		osc.stop(now + 0.12)
	}, [getAudioContext])

	/**
	 * Sonido de burbuja de diálogo - Efecto burbujeante y alegre
	 */
	const playBubblePop = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		// Primera burbuja - tono bajo que sube
		const bubble1 = ctx.createOscillator()
		const gain1 = ctx.createGain()

		bubble1.type = 'sine'
		bubble1.frequency.setValueAtTime(300, now)
		bubble1.frequency.exponentialRampToValueAtTime(800, now + 0.08)

		gain1.gain.setValueAtTime(0.15, now)
		gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

		bubble1.connect(gain1)
		gain1.connect(ctx.destination)

		bubble1.start(now)
		bubble1.stop(now + 0.1)

		// Segunda burbuja - tono medio
		const bubble2 = ctx.createOscillator()
		const gain2 = ctx.createGain()

		bubble2.type = 'sine'
		bubble2.frequency.setValueAtTime(500, now + 0.05)
		bubble2.frequency.exponentialRampToValueAtTime(1000, now + 0.13)

		gain2.gain.setValueAtTime(0.12, now + 0.05)
		gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

		bubble2.connect(gain2)
		gain2.connect(ctx.destination)

		bubble2.start(now + 0.05)
		bubble2.stop(now + 0.15)

		// "Pop" final - explosión de la burbuja
		const pop = ctx.createOscillator()
		const popGain = ctx.createGain()

		pop.type = 'square'
		pop.frequency.setValueAtTime(1200, now + 0.12)
		pop.frequency.exponentialRampToValueAtTime(2000, now + 0.15)

		popGain.gain.setValueAtTime(0.08, now + 0.12)
		popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)

		pop.connect(popGain)
		popGain.connect(ctx.destination)

		pop.start(now + 0.12)
		pop.stop(now + 0.18)

		// Efecto de brillo final
		const sparkle = ctx.createOscillator()
		const sparkleGain = ctx.createGain()

		sparkle.type = 'sine'
		sparkle.frequency.setValueAtTime(2000, now + 0.15)
		sparkle.frequency.exponentialRampToValueAtTime(3000, now + 0.25)

		sparkleGain.gain.setValueAtTime(0.05, now + 0.15)
		sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

		sparkle.connect(sparkleGain)
		sparkleGain.connect(ctx.destination)

		sparkle.start(now + 0.15)
		sparkle.stop(now + 0.25)
	}, [getAudioContext])

	/**
	 * Sonido de modal cerrado - UI suave
	 */
	const playModalClose = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		const osc = ctx.createOscillator()
		const gain = ctx.createGain()

		osc.type = 'sine'
		osc.frequency.setValueAtTime(600, now)
		osc.frequency.exponentialRampToValueAtTime(300, now + 0.08)

		gain.gain.setValueAtTime(0.15, now)
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

		osc.connect(gain)
		gain.connect(ctx.destination)

		osc.start(now)
		osc.stop(now + 0.1)
	}, [getAudioContext])

	/**
	 * Sonido de botón/click - UI feedback rápido
	 */
	const playClick = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		const osc = ctx.createOscillator()
		const gain = ctx.createGain()

		osc.type = 'square'
		osc.frequency.setValueAtTime(800, now)

		gain.gain.setValueAtTime(0.1, now)
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

		osc.connect(gain)
		gain.connect(ctx.destination)

		osc.start(now)
		osc.stop(now + 0.05)
	}, [getAudioContext])

	/**
	 * Efecto especial de tecla Espacio - Power-up futurista
	 */
	const playSpaceEffect = useCallback(() => {
		const ctx = getAudioContext()
		const now = ctx.currentTime

		// Efecto de "power-up" con múltiples capas
		const frequencies = [400, 500, 600, 800]
		
		frequencies.forEach((freq, index) => {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()
			
			osc.type = 'sine'
			osc.frequency.setValueAtTime(freq, now + index * 0.05)
			osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + index * 0.05 + 0.15)
			
			gain.gain.setValueAtTime(0.15, now + index * 0.05)
			gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.05 + 0.2)
			
			osc.connect(gain)
			gain.connect(ctx.destination)
			
			osc.start(now + index * 0.05)
			osc.stop(now + index * 0.05 + 0.2)
		})

		// Efecto adicional de "whoosh"
		const noise = ctx.createOscillator()
		const noiseGain = ctx.createGain()
		
		noise.type = 'sawtooth'
		noise.frequency.setValueAtTime(100, now)
		noise.frequency.exponentialRampToValueAtTime(2000, now + 0.3)
		
		noiseGain.gain.setValueAtTime(0.08, now)
		noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
		
		noise.connect(noiseGain)
		noiseGain.connect(ctx.destination)
		
		noise.start(now)
		noise.stop(now + 0.3)
	}, [getAudioContext])

	/**
	 * Música de fondo futurista - Ambiente continuo
	 */
	const startBackgroundMusic = useCallback(() => {
		if (isMusicPlayingRef.current) return

		const ctx = getAudioContext()
		
		// Reanudar el contexto si está suspendido (requerido por algunos navegadores)
		if (ctx.state === 'suspended') {
			ctx.resume()
		}

		const now = ctx.currentTime
		isMusicPlayingRef.current = true

		// Capas de ambiente futurista con frecuencias más alegres y sutiles
		const layers = [
			{ freq: 523.25, gain: 0.004, type: 'sine' as OscillatorType },  // C5 - Nota alta suave
			{ freq: 659.25, gain: 0.003, type: 'sine' as OscillatorType },  // E5 - Armonía brillante
			{ freq: 783.99, gain: 0.0025, type: 'sine' as OscillatorType }, // G5 - Acorde mayor
		]

		layers.forEach((layer, index) => {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()
			const lfo = ctx.createOscillator() // Low Frequency Oscillator para modulación
			const lfoGain = ctx.createGain()

			// Oscilador principal
			osc.type = layer.type
			osc.frequency.setValueAtTime(layer.freq, now)

			// LFO para modular el volumen (efecto pulsante muy sutil)
			lfo.type = 'sine'
			lfo.frequency.setValueAtTime(0.15 + index * 0.08, now) // Pulsación más rápida y sutil
			lfoGain.gain.setValueAtTime(layer.gain * 0.2, now)

			lfo.connect(lfoGain)
			lfoGain.connect(gain.gain)

			gain.gain.setValueAtTime(layer.gain, now)

			osc.connect(gain)
			gain.connect(ctx.destination)

			osc.start(now)
			lfo.start(now)

			// Guardar referencias para poder detenerlos después
			backgroundMusicNodesRef.current.oscillators.push(osc, lfo)
			backgroundMusicNodesRef.current.gains.push(gain, lfoGain)
		})

		// Capa de "estrellas" - tonos aleatorios suaves y brillantes
		const createStarLayer = () => {
			if (!isMusicPlayingRef.current) return

			const ctx = getAudioContext()
			const now = ctx.currentTime
			
			const freq = 1200 + Math.random() * 1000 // Frecuencias más altas y brillantes
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()
			
			osc.type = 'sine'
			osc.frequency.setValueAtTime(freq, now)
			
			gain.gain.setValueAtTime(0, now)
			gain.gain.linearRampToValueAtTime(0.003, now + 0.5) // Volumen mucho más bajo
			gain.gain.linearRampToValueAtTime(0, now + 2.5)
			
			osc.connect(gain)
			gain.connect(ctx.destination)
			
			osc.start(now)
			osc.stop(now + 2.5)
			
			// Programar siguiente "estrella"
			setTimeout(() => createStarLayer(), 1000 + Math.random() * 2000)
		}

		// Iniciar capa de estrellas
		createStarLayer()
	}, [getAudioContext])

	/**
	 * Detener música de fondo
	 */
	const stopBackgroundMusic = useCallback(() => {
		if (!isMusicPlayingRef.current) return

		isMusicPlayingRef.current = false
		
		const { oscillators, gains } = backgroundMusicNodesRef.current
		const ctx = getAudioContext()
		const now = ctx.currentTime

		// Fade out suave
		gains.forEach(gain => {
			gain.gain.exponentialRampToValueAtTime(0.001, now + 1)
		})

		// Detener osciladores después del fade out
		setTimeout(() => {
			oscillators.forEach(osc => {
				try {
					osc.stop()
				} catch {
					// Ignorar si el oscilador ya fue detenido
				}
			})
			
			// Limpiar referencias
			backgroundMusicNodesRef.current = { oscillators: [], gains: [] }
		}, 1100)
	}, [getAudioContext])

	return {
		playNodeCreated,
		playNodeInitialization,
		playMissionComplete,
		playXPGained,
		playModalOpen,
		playModalClose,
		playClick,
		playSpaceEffect,
		playBubblePop,
		startBackgroundMusic,
		stopBackgroundMusic,
	}
}
