// human
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAudit } from '../../backend/services/auditService.js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid report ID' })
    }

    const report = getAudit(id)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    return res.json(report)

  } catch (error: any) {
    console.error('Get report failed:', error)
    return res.status(500).json({ 
      message: error?.message || 'Failed to retrieve report' 
    })
  }
}