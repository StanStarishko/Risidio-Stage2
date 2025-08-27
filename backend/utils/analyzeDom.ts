// human
import * as cheerio from 'cheerio'

export async function analyzeDom(html: string) {
  const $ = cheerio.load(html)
  
  // Basic element counts
  const imgs = $('img')
  const links = $('a')
  const forms = $('form')
  const buttons = $('button, input[type="submit"], input[type="button"]')
  
  // Heading structure analysis
  const headings = ['h1','h2','h3','h4','h5','h6'].map(tag => ({
    tag, 
    count: $(tag).length,
    texts: $(tag).map((_, el) => $(el).text().trim().substring(0, 50)).get()
  }))
  
  // Accessibility analysis
  const missingAlt = imgs.filter((_, el) => !$(el).attr('alt')).length
  const emptyAlt = imgs.filter((_, el) => $(el).attr('alt') === '').length
  const decorativeImages = imgs.filter((_, el) => $(el).attr('alt') === '').length
  
  // Form accessibility
  const inputsWithoutLabels = $('input[type="text"], input[type="email"], input[type="password"], textarea')
    .filter((_, el) => {
      const $el = $(el)
      const hasAriaLabel = !!$el.attr('aria-label')
      const hasLabel = !!$(`label[for="${$el.attr('id')}"]`).length
      return !hasAriaLabel && !hasLabel
    })
    .length
  
  // Link analysis
  const vagueLinkTexts = links.filter((_, el) => {
    const text = $(el).text().trim().toLowerCase()
    return ['click here', 'read more', 'more', 'here', 'link'].includes(text)
  }).length
  
  const externalLinks = links.filter((_, el) => {
    const href = $(el).attr('href')
    return !!href && (href.startsWith('http') || href.startsWith('//'))
  }).length
  
  // SEO analysis
  const title = $('title').text().trim() || null
  const metaDesc = $('meta[name="description"]').attr('content')?.trim() || null
  const metaKeywords = $('meta[name="keywords"]').attr('content')?.trim() || null
  const metaViewport = $('meta[name="viewport"]').attr('content') || null
  
  // Performance-related mock analysis
  const scriptTags = $('script').length
  const stylesheetTags = $('link[rel="stylesheet"]').length
  const inlineStyles = $('[style]').length
  
  // Color contrast mock analysis (simplified)
  const potentialContrastIssues = $('*').filter((_, el) => {
    const style = $(el).attr('style') || ''
    return style.includes('color:') && (
      style.includes('color: white') || 
      style.includes('color: yellow') || 
      style.includes('color: #fff')
    )
  }).length
  
  // Content quality analysis
  const totalTextLength = $('body').text().replace(/\s+/g, ' ').trim().length
  const paragraphs = $('p').length
  const avgParagraphLength = paragraphs > 0 ? Math.round(totalTextLength / paragraphs) : 0
  
  // Modern web features check
  const hasLazyLoading = imgs.filter((_, el) => $(el).attr('loading') === 'lazy').length
  const hasAriaLabels = $('[aria-label]').length
  const hasSkipLinks = $('a[href^="#"]').filter((_, el) => 
    $(el).text().toLowerCase().includes('skip')
  ).length

  return {
    counts: {
      images: imgs.length,
      links: links.length,
      forms: forms.length,
      buttons: buttons.length,
      paragraphs: paragraphs,
      scripts: scriptTags,
      stylesheets: stylesheetTags,
    },
    headings,
    accessibility: {
      imagesMissingAlt: missingAlt,
      imagesEmptyAlt: emptyAlt,
      decorativeImages: decorativeImages,
      inputsWithoutLabels: inputsWithoutLabels,
      hasAriaLabels: hasAriaLabels > 0,
      hasSkipLinks: hasSkipLinks > 0,
      potentialContrastIssues: potentialContrastIssues,
    },
    seo: {
      title,
      titleLength: title?.length || 0,
      metaDescriptionPresent: !!metaDesc,
      metaDescriptionLength: metaDesc?.length || 0,
      hasMetaKeywords: !!metaKeywords,
      hasViewportMeta: !!metaViewport,
    },
    links: {
      total: links.length,
      external: externalLinks,
      vagueLinkTexts: vagueLinkTexts,
    },
    content: {
      totalTextLength,
      avgParagraphLength,
      readabilityScore: Math.min(100, Math.max(0, 100 - avgParagraphLength / 10)), // Simple readability mock
    },
    performance: {
      inlineStyles: inlineStyles,
      hasLazyLoading: hasLazyLoading > 0,
      lazyImagesCount: hasLazyLoading,
    },
    modernFeatures: {
      responsiveImages: imgs.filter((_, el) => !!$(el).attr('srcset')).length,
      semanticHtml: $('main, article, section, nav, aside, header, footer').length,
    }
  }
}