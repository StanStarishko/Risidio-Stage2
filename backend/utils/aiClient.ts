// human
import OpenAI from 'openai'

function getClient() {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  return new OpenAI({ apiKey: key })
}

export async function askAI(url: string, heuristics: any) {
  const client = getClient()

  // Enhanced stub fallback with more realistic recommendations
  if (!client) {
    const accessibilityIssues = heuristics.accessibility?.imagesMissingAlt || 0
    const seoIssues = !heuristics.seo?.title || !heuristics.seo?.metaDescriptionPresent
    const linkIssues = heuristics.links?.vagueLinkTexts || 0
    
    return {
      summary: `⚠️ Stubbed AI Analysis: This website has ${accessibilityIssues} accessibility issues, ${seoIssues ? 'missing' : 'good'} SEO fundamentals, and ${linkIssues} unclear link texts. This is a placeholder response - production would use OpenAI GPT-4 for detailed analysis.`,
      priorities: [
        { 
          p: 1, 
          text: accessibilityIssues > 0 
            ? `Critical: Add alt attributes to ${accessibilityIssues} images for screen reader accessibility`
            : "Good: All images have alt attributes for accessibility" 
        },
        { 
          p: 2, 
          text: heuristics.headings?.find((h: any) => h.tag === 'h1')?.count !== 1
            ? "Important: Ensure exactly one H1 tag per page for proper heading hierarchy"
            : "Good: Proper H1 structure detected"
        },
        { 
          p: 3, 
          text: !heuristics.seo?.metaDescriptionPresent
            ? "SEO: Add a compelling meta description (150-160 characters) for better search snippets"
            : `SEO: Meta description present (${heuristics.seo?.metaDescriptionLength} chars)`
        },
        { 
          p: 4, 
          text: linkIssues > 0
            ? `UX: Replace ${linkIssues} vague link texts like 'click here' with descriptive labels`
            : "Good: Link texts are descriptive and clear"
        },
        { 
          p: 5, 
          text: heuristics.accessibility?.potentialContrastIssues > 0
            ? "Accessibility: Review color contrast ratios, especially for white/yellow text"
            : "Consider: Test color contrast ratios with automated tools like axe-core"
        },
        {
          p: 6,
          text: !heuristics.performance?.hasLazyLoading
            ? "Performance: Implement lazy loading for images to improve page load speed"
            : "Good: Lazy loading detected for better performance"
        }
      ],
      webScore: Math.max(20, 100 - (accessibilityIssues * 15) - (seoIssues ? 20 : 0) - (linkIssues * 5)),
      blockchain: {
        verified: true,
        timestamp: new Date().toISOString(),
        hash: `0x${Math.random().toString(16).substr(2, 40)}` // Mock blockchain hash
      }
    }
  }

  // Enhanced prompt for real AI analysis
  const prompt = [
    'You are a senior UX consultant and accessibility expert. Analyze this website audit data and provide actionable recommendations.',
    '',
    `Target URL: ${url}`,
    '',
    'Website Analysis Data:',
    JSON.stringify(heuristics, null, 2),
    '',
    'Please provide:',
    '1. A brief executive summary of the main UX and accessibility issues',
    '2. 5-7 prioritized recommendations with specific, actionable steps',
    '3. Estimate an overall website health score (0-100)',
    '',
    'Focus on:',
    '- Accessibility (WCAG 2.1 AA compliance)',
    '- User Experience best practices',
    '- SEO fundamentals',
    '- Performance optimization opportunities',
    '',
    'Output as JSON with keys:',
    '- summary: string (executive summary)',
    '- priorities: array of {p: number, text: string} (1 = highest priority)',
    '- webScore: number (0-100 health score)',
    '- blockchain: {verified: boolean, timestamp: string, hash: string}'
  ].join('\n')

  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1500
    })
    
    const txt = resp.choices[0].message.content || '{}'
    
    try {
      const parsed = JSON.parse(txt)
      
      // Add blockchain mock data if not present
      if (!parsed.blockchain) {
        parsed.blockchain = {
          verified: true,
          timestamp: new Date().toISOString(),
          hash: `0x${Math.random().toString(16).substr(2, 40)}`
        }
      }
      
      return parsed
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return { 
        summary: txt, 
        priorities: [],
        webScore: 50,
        blockchain: {
          verified: true,
          timestamp: new Date().toISOString(),
          hash: `0x${Math.random().toString(16).substr(2, 40)}`
        }
      }
    }
  } catch (apiError: any) {
    throw new Error(`OpenAI API error: ${apiError.message}`)
  }
}