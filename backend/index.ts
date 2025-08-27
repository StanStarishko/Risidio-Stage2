// human
import express from 'express'
import cors from 'cors'

const app = express()

// Explicit CORS to avoid "Failed to fetch"
app.use(cors({
  origin: ['/api/audit'],
  credentials: true,
}))
app.use(express.json())

app.get('/', (_req, res) => res.json({ ok: true, service: 'ai-ux-audit-backend' }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`[backend] listening on http://localhost:${PORT}`)
})
