// human
import type { NextApiRequest, NextApiResponse } from 'next'
import { runAudit } from '../../backend/services/auditService.js'
import { z } from 'zod'

const AuditReq = z.object({ url: z.string().url() })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const parsed = AuditReq.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid URL provided' })
    }

    const id = await runAudit(parsed.data.url)
    return res.json({ id })

  } catch (error: any) {
    console.error('Audit failed:', error)
    return res.status(500).json({ 
      message: error?.message || 'Audit failed' 
    })
  }
}