// components/invoices/PayInvoice.tsx
import { Stack, Typography, TextField, Button, CircularProgress } from '@mui/material'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { useState } from 'react'
import { border, lightning, text } from '../../theme/colors'

const API_URL = import.meta.env.VITE_API_BASE

function PayInvoice() {
  const [paymentRequest, setPaymentRequest] = useState('')
  const [result, setResult] = useState<{ status: string; amount_sats: number; memo: string; payment_hash: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    if (!paymentRequest.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/invoice/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_request: paymentRequest }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Error al pagar invoice')
      setResult(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setPaymentRequest('')
    setError('')
  }

  if (result) {
    return (
      <Stack spacing={2}>
        <Stack direction="row" spacing={0.8} alignItems="center">
          <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
          <Typography variant="body2" fontWeight={700} color="success.main">Pago exitoso</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">Monto</Typography>
          <Typography variant="caption" fontWeight={700}>{result.amount_sats} sats</Typography>
        </Stack>

        {result.memo && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">Memo</Typography>
            <Typography variant="caption" fontWeight={700}>{result.memo}</Typography>
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">Estado</Typography>
          <Typography variant="caption" fontWeight={700} color="success.main">{result.status}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="caption" color="text.secondary">Payment Hash</Typography>
          <Typography variant="caption" fontWeight={700} sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.7rem', maxWidth: '60%', textAlign: 'right' }}>
            {result.payment_hash}
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={handleReset}
          sx={{ borderColor: border.medium, color: text.primary, textTransform: 'none' }}
        >
          Pagar otro
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Payment Request"
        value={paymentRequest}
        onChange={(e) => setPaymentRequest(e.target.value)}
        size="small"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="lnbc..."
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
        onClick={handlePay}
        disabled={!paymentRequest.trim() || loading}
        sx={{
          py: 1.2,
          fontWeight: 700,
          background: `linear-gradient(180deg, ${lightning.primary} 0%, ${lightning.dark} 100%)`,
          '&:hover': { background: `linear-gradient(180deg, ${lightning.light} 0%, ${lightning.primary} 100%)` },
        }}
      >
        {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Pagar Invoice'}
      </Button>
    </Stack>
  )
}

export default PayInvoice