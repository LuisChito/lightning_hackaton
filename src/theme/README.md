# Sistema de Colores - Lightning Quest

Este directorio contiene el sistema de colores centralizado del proyecto.

## 🎨 Paleta Actual: **Light Mode - Videojuego Moderno**

Paleta clara, vibrante y profesional diseñada para una experiencia visual moderna estilo videojuego.

## Archivo Principal

### `colors.ts`

Exporta todas las constantes de colores organizadas por categoría:

```typescript
import { lightning, border, background, text, status } from './theme/colors';
```

## Categorías de Colores

### Background (Claros y Limpios)
- `background.primary` - Fondo principal blanco (#ffffff)
- `background.secondary` - Fondo secundario muy claro (#f8fafc)
- `background.dark` - Fondo claro grisáceo (#f1f5f9)
- `background.panel` - Paneles con transparencia
- `background.card` - Cards de componentes (blancos)
- `background.gradient1-4` - Gradientes sutiles para fondos

### Text (Oscuros para Contraste)
- `text.primary` - Texto principal oscuro (#0f172a)
- `text.secondary` - Texto secundario gris (#475569)
- `text.light` - Texto gris claro (#64748b)

### Border (Sutiles y Discretos)
- `border.primary` - Borde principal suave
- `border.light` - Borde muy ligero
- `border.subtle` - Borde sutil
- `border.strong` - Borde con más presencia
- `border.divider` - Divisores claros
- `border.canvas` - Borde del canvas

### Lightning (Amarillo/Naranja Vibrante) ⚡
- `lightning.primary` - Color principal Lightning (#f59e0b)
- `lightning.light` - Variante clara (#fbbf24)
- `lightning.dark` - Variante oscura (#d97706)
- `lightning.border*` - Variantes de bordes con opacidad
- `lightning.background*` - Fondos cálidos y sutiles

### Primary (Azul Moderno) 🔵
- `primary.main` - Azul vibrante (#3b82f6)
- `primary.dark` - Azul intenso (#2563eb)
- `primary.light` - Variante clara con transparencia
- `primary.lighter` - Variante más clara

### Status (Estados del Sistema)
- `status.success` - Verde moderno (#10b981)
- `status.successBorder` - Borde de éxito
- `status.successBg` - Fondo de éxito suave
- `status.error` - Rojo vibrante (#ef4444)
- `status.errorBorder` - Borde de error
- `status.warning` - Amarillo de advertencia

### Purple (Acento Moderno) 💜
- `purple.main` - Púrpura vibrante (#8b5cf6)
- `purple.light` - Variante clara (#a78bfa)
- `purple.background` - Fondo púrpura suave

### Canvas
- `canvas.background` - Fondo sutil para el canvas de red

## Uso

### En componentes React/MUI:

```tsx
import { lightning, background } from '../../theme/colors';

<Box sx={{ 
  backgroundColor: background.card,
  border: `1px solid ${lightning.border}`
}} />
```

### En CSS (usando variables CSS):

```css
.elemento {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}
```

## Variables CSS Disponibles

Consulta `src/index.css` para ver todas las variables CSS definidas con el prefijo `--color-*`.

## Beneficios

✅ **Mantenibilidad**: Cambios de color en un solo lugar  
✅ **Consistencia**: Toda la app usa los mismos colores  
✅ **Legibilidad**: Nombres descriptivos en lugar de valores hex  
✅ **TypeScript**: Autocompletado y verificación de tipos  
✅ **Escalabilidad**: Fácil agregar nuevos colores o temas

## Agregar Nuevos Colores

1. Edita `src/theme/colors.ts`
2. Agrega el color en la categoría apropiada
3. Exporta si es necesario
4. Usa en tus componentes

```typescript
export const colors = {
  // ... categorías existentes
  nuevo: {
    color1: '#abcdef',
    color2: 'rgba(1, 2, 3, 0.5)',
  }
}
```
