    // features/missions/shared/components/InvoiceTab.tsx
    import { Box, Typography, Button, IconButton, Stack, Divider } from '@mui/material'
    import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
    import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
    import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
    import { useState } from 'react'
    import { border, background, lightning, text } from '../../theme/colors'

    import CreateInvoice from './CreateInvoice'
    import PayInvoice from './PayInvoice'

    type InvoiceView = 'menu' | 'create' | 'pay'

    function InvoiceTab() {
    const [view, setView] = useState<InvoiceView>('menu')

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
                <Typography variant="body2" fontWeight={700}>Crear Invoice</Typography>
                <Typography variant="caption" sx={{ color: text.secondary }}>
                    Genera una solicitud de pago
                </Typography>
                </Box>
            </Button>

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
            </Stack>
        )}

        {/* Vista: Crear Invoice */}
        {view === 'create' && (
        <>
            <Divider sx={{ borderColor: border.divider }} />
            <CreateInvoice />
        </>
        )}

        {/* Vista: Pagar Invoice */}
        {view === 'pay' && (
        <>
            <Divider sx={{ borderColor: border.divider }} />
            <PayInvoice />
        </>
        )}

        </Box>
    )
    }

    export default InvoiceTab
