human
Stanislav Starishko
Stage 2 Screener: the AI-Driven Software Engineer cohort at Risidio
Email: slavkost73@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/starishko/
🔗 GitHub: https://github.com/StanStarishko/Portfolio/
Date: 27/08/2025 | Start time: 17:00  | Finish time: 

# AI-powered UX Audit Tool — Summary

human
## Why
To provide small teams with a fast, directional UX and accessibility review without a full research cycle.

## What
A web app where the user submits a URL. The backend fetches the HTML, performs quick heuristics (headings, alt attributes, contrast sampling, metadata), then asks an LLM for actionable recommendations grouped by theme.

## Who
- Primary: founders, solo developers, and small product teams.
- Secondary: agencies gathering discovery insights for pre-sales.

## How
- Frontend: Next.js + Tailwind CSS; skimmable dashboard + permalink report.
- Backend: Node.js (Express) with HTML fetch & heuristics; OpenAI for structured advice.
- Hosting: Vercel or split FE/BE as needed.
- Deliverables Today: working MVP (URL → report), GitHub repo link, live demo, screenshots.

## Scope (One-day)
- MVP flow: Submit URL → Heuristics → LLM summary → Report UI.
- Must-haves: alt coverage, H1/H2/H3 map, link count, meta presence, quick wins list.
- Nice-to-haves: PDF export, shareable link, attach Lighthouse JSON.

## Risks & Mitigations
- CORS/blocked fetch: server-side fetch; fallback to pasted HTML.
- Heuristic accuracy: present raw stats alongside advice; clarify directional nature.
- Rate limits: cache results per URL for 15 minutes.
