    // features/missions/shared/components/InvoiceTab.tsx
    import { Box, Typography, Button, IconButton, Stack, Divider } from '@mui/material'
    import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
    import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
    import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
    import { useState } from 'react'
    import { border, background, lightning, text } from '../../theme/colors'
    import { useMission3Store } from '../../features/missions/mission3/store/useMission3Store'

    import CreateInvoice from './CreateInvoice'
    import PayInvoice from './PayInvoice'

    type InvoiceView = 'menu' | 'create' | 'pay'
    type NodeRole = 'source' | 'target' | 'both' | 'none'

    interface InvoiceTabProps {
      nodeRole: NodeRole
      channelCapacity: number
      isMission3Active?: boolean
      onPaymentSuccess?: (amountSats: number) => void
    }

        function InvoiceTab({ nodeRole, channelCapacity, isMission3Active = false, onPaymentSuccess }: InvoiceTabProps) {
    const [view, setView] = useState<InvoiceView>('menu')
    const { onInvoiceHashCopied } = useMission3Store()
    
    // Determinar qué opciones mostrar según el rol
    const canCreateInvoice = nodeRole === 'target' || nodeRole === 'both'
    const canPayInvoice = nodeRole === 'source' || nodeRole === 'both'

    const handleInvoiceHashCopied = () => {
      onInvoiceHashCopied()
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>

        {/* Header con back button cuando no estamos en menu */}
        {view !== 'menu' && (
            <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
                size="small"
                onClick={() => setView('menu')}
                sx={{
                color: text.secondary,
                '&:hover': { color: lightning.primary },
                }}
            >
                <ArrowBackRoundedIcon fontSize="small" />
            </IconButton>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: text.primary }}>
                {view === 'create' ? 'Crear Invoice' : 'Pagar Invoice'}
            </Typography>
            </Stack>
        )}

        {/* Vista: Menu principal */}
        {view === 'menu' && (
            <Stack spacing={1.5}>
            <Typography variant="caption" sx={{ color: text.secondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Selecciona una acción
            </Typography>

            {canCreateInvoice && (
            <Button
                fullWidth
                variant="outlined"
                startIcon={<ReceiptLongRoundedIcon />}
                onClick={() => setView('create')}
                sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                borderRadius: 2,
                borderColor: isMission3Active ? lightning.primary : border.medium,
                borderWidth: isMission3Active ? 2 : 1,
                color: text.primary,
                backgroundColor: isMission3Active ? `${lightning.primary}15` : background.panelLight,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                position: 'relative',
                animation: isMission3Active ? 'pulse 2s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                    '0%, 100%': {
                        boxShadow: `0 0 0 0 ${lightning.primary}40`,
                    },
                    '50%': {
                        boxShadow: `0 0 0 8px ${lightning.primary}00`,
                    },
                },
                '&:hover': {
                    borderColor: lightning.primary,
                    backgroundColor: `${lightning.primary}10`,
                    color: lightning.dark,
                },
                }}
            >
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography variant="body2" fontWeight={700}>Crear Invoice</Typography>
                <Typography variant="caption" sx={{ color: text.secondary }}>
                    Genera una solicitud de pago
                </Typography>
                </Box>
                {isMission3Active && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: lightning.primary,
                        color: '#000',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: `0 2px 8px ${lightning.primary}60`,
                    }}
                >
                    !
                </Box>
                )}
            </Button>
            )}

            {canPayInvoice && (
            <Button
                fullWidth
                variant="outlined"
                startIcon={<PaymentsRoundedIcon />}
                onClick={() => setView('pay')}
                sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                borderRadius: 2,
                borderColor: border.medium,
                color: text.primary,
                backgroundColor: background.panelLight,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                '&:hover': {
                    borderColor: lightning.primary,
                    backgroundColor: `${lightning.primary}10`,
                    color: lightning.dark,
                },
                }}
            >
                <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" fontWeight={700}>Pagar Invoice</Typography>
                <Typography variant="caption" sx={{ color: text.secondary }}>
                    Pega y envía un payment request
                </Typography>
                </Box>
            </Button>
            )}
            
            {!canCreateInvoice && !canPayInvoice && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Este nodo no tiene canales activos para realizar pagos.
              </Typography>
            )}
            </Stack>
        )}

        {/* Vista: Crear Invoice */}
        {view === 'create' && (
        <>
            <Divider sx={{ borderColor: border.divider }} />
            <CreateInvoice maxAmount={channelCapacity} onInvoiceHashCopied={handleInvoiceHashCopied} />
        </>
        )}

        {/* Vista: Pagar Invoice */}
        {view === 'pay' && (
        <>
            <Divider sx={{ borderColor: border.divider }} />
            <PayInvoice onPaymentSuccess={onPaymentSuccess} />
        </>
        )}

        </Box>
    )
    }

    export default InvoiceTab
