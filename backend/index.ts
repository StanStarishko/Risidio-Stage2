// human
import express from 'express'
import cors from 'cors'
import { auditRouter } from './routes/audit.js'

const app = express()

// Explicit CORS to avoid "Failed to fetch"
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

app.get('/', (_req, res) => res.json({ ok: true, service: 'ai-ux-audit-backend' }))
app.use('/audit', auditRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`[backend] listening on http://localhost:${PORT}`)
})
