// human
import OpenAI from 'openai'

function getClient() {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  return new OpenAI({ apiKey: key })
}

export async function askAI(url: string, heuristics: any) {
  const client = getClient()

  // Stub fallback if API key is missing
  if (!client) {
    return {
      summary: "⚠️ Stubbed response: OpenAI API not available. This is a placeholder instead of a paid service.",
      priorities: [
        { p: 1, text: "Stub: Add alt attributes to informative images." },
        { p: 2, text: "Stub: Ensure exactly one H1 and logical H2/H3 hierarchy." },
        { p: 3, text: "Stub: Provide a concise meta description for better snippets." },
        { p: 4, text: "Stub: Improve link text clarity and avoid vague labels like 'click here'." },
        { p: 5, text: "Stub: Check colour contrast for text on images and buttons." },
      ],
    }
  }

  // Real call if API key is set
  const prompt = [
    'You are a UX consultant. Provide 5–7 actionable recommendations based on the following heuristics.',
    `Target URL: ${url}`,
    'Heuristics JSON:',
    JSON.stringify(heuristics, null, 2),
    'Output as JSON with keys: summary (string), priorities (array of {p:number,text:string}).'
  ].join('\n')

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  })
  const txt = resp.choices[0].message.content || '{}'
  try {
    return JSON.parse(txt)
  } catch {
    return { summary: txt, priorities: [] }
  }
}
