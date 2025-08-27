// human
import * as cheerio from 'cheerio'

export async function analyseDom(html: string) {
  const $ = cheerio.load(html)
  const imgs = $('img')
  const links = $('a')
  const headings = ['h1','h2','h3','h4','h5','h6'].map(tag => ({
    tag, count: $(tag).length
  }))
  const missingAlt = imgs.filter((_, el) => !$(el).attr('alt')?.trim()).length
  const metaDesc = $('meta[name="description"]').attr('content') || null
  const title = $('title').text() || null

  return {
    counts: {
      images: imgs.length,
      links: links.length,
    },
    headings,
    accessibility: {
      imagesMissingAlt: missingAlt,
    },
    seo: {
      title,
      metaDescriptionPresent: !!metaDesc,
    },
  }
}
