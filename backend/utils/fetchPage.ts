// human
import fetch from 'node-fetch'

export async function fetchPage(url: string): Promise<string> {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; AI-UX-Audit/1.0; +https://example.com/bot)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }

  // Create AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const res = await fetch(url, { 
      headers,
      signal: controller.signal,
      follow: 5, // Follow up to 5 redirects
      size: 1024 * 1024 * 2 // 2MB max response size
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      throw new Error(`Invalid content type: ${contentType}. Expected HTML document.`)
    }

    const html = await res.text()
    
    if (!html.trim()) {
      throw new Error('Empty HTML document received')
    }

    // Basic HTML validation
    if (!html.toLowerCase().includes('<html') && !html.toLowerCase().includes('<!doctype')) {
      throw new Error('Invalid HTML document - missing HTML tags')
    }

    return html
    
  } catch (error: any) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. The website took too long to respond.')
    }
    
    if (error.name === 'FetchError') {
      if (error.code === 'ENOTFOUND') {
        throw new Error('Domain not found. Please check the URL and try again.')
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. The website may be down or blocking requests.')
      } else {
        throw new Error(`Network error: ${error.message}`)
      }
    }
    
    // Re-throw our custom errors
    throw error
  }
}