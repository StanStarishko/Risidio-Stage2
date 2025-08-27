// human
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[TEST] ${req.method} /api/test`)
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  return res.status(200).json({ 
    ok: true, 
    method: req.method,
    timestamp: new Date().toISOString(),
    message: 'API is working correctly! Endpoint found in pages/api/',
    path: '/api/test'
  })
}