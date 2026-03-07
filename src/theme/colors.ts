
/**
 * Sistema de colores centralizado para Lightning Quest
 * Paleta clara, moderna y profesional estilo videojuego
 */

export const colors = {
  // Backgrounds - Claros y limpios
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    dark: '#f1f5f9',
    panel: 'rgba(255, 255, 255, 0.95)',
    panelLight: 'rgba(248, 250, 252, 0.98)',
    card: 'rgba(255, 255, 255, 0.9)',
    gradient1: 'rgba(241, 245, 249, 0.98)',
    gradient2: 'rgba(248, 250, 252, 0.98)',
    gradient3: 'rgba(226, 232, 240, 0.95)',
    gradient4: 'rgba(241, 245, 249, 0.95)',
    overlay: 'rgba(148, 163, 184, 0.15)',
  },

  // Texto - Oscuros para contraste
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    light: '#64748b',
  },

  // Bordes - Sutiles y claros
  border: {
    primary: 'rgba(148, 163, 184, 0.25)',
    light: 'rgba(203, 213, 225, 0.5)',
    medium: 'rgba(148, 163, 184, 0.35)',
    strong: 'rgba(100, 116, 139, 0.4)',
    divider: 'rgba(226, 232, 240, 0.8)',
    subtle: 'rgba(203, 213, 225, 0.4)',
    canvas: 'rgba(203, 213, 225, 0.6)',
  },

  // Lightning/Amarillo - Vibrante y energético
  lightning: {
    primary: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    border: 'rgba(245, 158, 11, 0.4)',
    borderMedium: 'rgba(245, 158, 11, 0.5)',
    borderStrong: 'rgba(245, 158, 11, 0.8)',
    background: 'rgba(254, 243, 199, 0.6)',
    backgroundLight: 'rgba(254, 243, 199, 0.4)',
  },

  // Azul primario - Moderno y profesional
  primary: {
    main: '#3b82f6',
    light: 'rgba(59, 130, 246, 0.15)',
    lighter: 'rgba(147, 197, 253, 0.25)',
    dark: '#2563eb',
  },

  // Estados
  status: {
    success: '#10b981',
    successBorder: 'rgba(16, 185, 129, 0.4)',
    successBg: 'rgba(209, 250, 229, 0.6)',
    error: '#ef4444',
    errorBorder: 'rgba(239, 68, 68, 0.4)',
    warning: '#f59e0b',
  },

  // Púrpura - Acento moderno
  purple: {
    main: '#8b5cf6',
    light: '#a78bfa',
    background: 'rgba(139, 92, 246, 0.15)',
  },

  // Background para canvas
  canvas: {
    background: 'rgba(226, 232, 240, 0.4)',
  },
} as const;

// Exportar colores individuales para fácil acceso
export const {
  background,
  text,
  border,
  lightning,
  primary,
  status,
  purple,
  canvas,
} = colors;
