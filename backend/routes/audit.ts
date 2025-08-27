// human
import { Router } from 'express'
import { runAudit, getAudit } from '../services/auditService.js'
import { z } from 'zod'

export const auditRouter = Router()

const AuditReq = z.object({ url: z.string().url() })

auditRouter.post('/', async (req, res) => {
  const parsed = AuditReq.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid URL' })
  try {
    const id = await runAudit(parsed.data.url)
    res.json({ id })
  } catch (err:any) {
    res.status(500).json({ message: err?.message || 'Audit failed' })
  }
})

auditRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const report = getAudit(id)
  if (!report) return res.status(404).json({ message: 'Not found' })
  res.json(report)
})
