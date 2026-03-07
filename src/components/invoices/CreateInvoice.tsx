// components/invoices/CreateInvoice.tsx
import { Box, Stack, Typography, TextField, Button, CircularProgress } from '@mui/material'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { useState } from 'react'
import { border, background, lightning, text } from '../../theme/colors'

const API_URL = import.meta.env.VITE_API_BASE

function CreateInvoice() {
  const [amountSats, setAmountSats] = useState('')
  const [memo, setMemo] = useState('')
  const [invoice, setInvoice] = useState<{ payment_request: string; qr_base64: string; amount_sats: number; memo: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!amountSats || Number(amountSats) <= 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_sats: Number(amountSats), memo }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Error al crear invoice')
      setInvoice(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setInvoice(null)
    setAmountSats('')
    setMemo('')
    setError('')
  }

  if (invoice) {
    return (
      <Stack spacing={2}>
        <Stack direction="row" spacing={0.8} alignItems="center">
          <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
          <Typography variant="body2" fontWeight={700} color="success.main">Invoice creado</Typography>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={`data:image/png;base64,${invoice.qr_base64}`}
            alt="QR Invoice"
            sx={{ width: 160, height: 160, borderRadius: 1, border: `1px solid ${border.medium}` }}
          />
        </Box>

        <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: background.secondary, border: `1px solid ${border.subtle}` }}>
          <Typography variant="caption" sx={{ color: text.secondary, fontWeight: 600, display: 'block', mb: 0.5 }}>
            Payment Request
          </Typography>
          <Typography variant="caption" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.7rem' }}>
            {invoice.payment_request}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">Monto</Typography>
          <Typography variant="caption" fontWeight={700}>{invoice.amount_sats} sats</Typography>
        </Stack>

        {invoice.memo && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">Memo</Typography>
            <Typography variant="caption" fontWeight={700}>{invoice.memo}</Typography>
          </Stack>
        )}

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={handleReset}
          sx={{ borderColor: border.medium, color: text.primary, textTransform: 'none' }}
        >
          Crear otro
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Cantidad (sats)"
        type="number"
        value={amountSats}
        onChange={(e) => setAmountSats(e.target.value)}
        size="small"
        fullWidth
        variant="outlined"
        placeholder="ej. 1000"
      />
      <TextField
        label="Memo (opcional)"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        size="small"
        fullWidth
        variant="outlined"
        placeholder="ej. Pago por café"
      />

      {error && (
        <Stack direction="row" spacing={0.8} alignItems="center">
          <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: 'error.main' }} />
          <Typography variant="caption" color="error">{error}</Typography>
        </Stack>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleCreate}
        disabled={!amountSats || Number(amountSats) <= 0 || loading}
        sx={{
          py: 1.2,
          fontWeight: 700,
          background: `linear-gradient(180deg, ${lightning.primary} 0%, ${lightning.dark} 100%)`,
          '&:hover': { background: `linear-gradient(180deg, ${lightning.light} 0%, ${lightning.primary} 100%)` },
        }}
      >
        {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Generar Invoice'}
      </Button>
    </Stack>
  )
}

export default CreateInvoice