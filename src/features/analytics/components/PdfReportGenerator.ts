import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { AnalysisResult } from '../types'

// Brand colors
const ORANGE = [234, 88, 12] as const // orange-600
const DARK = [17, 24, 39] as const // gray-900
const GRAY = [107, 114, 128] as const // gray-500
const GREEN = [5, 150, 105] as const // emerald-600
const WHITE = [255, 255, 255] as const

function addHeader(doc: jsPDF, y: number, text: string): number {
  doc.setFontSize(14)
  doc.setTextColor(...DARK)
  doc.setFont('helvetica', 'bold')
  doc.text(text, 20, y)
  doc.setDrawColor(...ORANGE)
  doc.setLineWidth(0.5)
  doc.line(20, y + 2, 190, y + 2)
  return y + 10
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage()
    return 20
  }
  return y
}

export function generatePdfReport(result: AnalysisResult): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // ── Title Page ──────────────────────────────────────────────────────
  // Orange header bar
  doc.setFillColor(...ORANGE)
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setTextColor(...WHITE)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Review Analytics Report', 20, 22)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Powered by Pixii.ai', 20, 32)

  // Query info
  let y = 58
  doc.setTextColor(...DARK)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')

  if (result.userAsin) {
    doc.text(
      `Your Listing (ASIN: ${result.userAsin}) vs. ${result.competitors.filter(c => !c.isUserListing).length} Competitors`,
      20,
      y
    )
  } else {
    doc.text(`Market Analysis: "${result.query}"`, 20, y)
  }

  y += 8
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.text(
    `${result.totalProducts} products | ${result.totalReviews} reviews analyzed | ${result.category} | Generated ${new Date(result.generatedAt).toLocaleDateString()}`,
    20,
    y
  )

  // ── Killer Insight ──────────────────────────────────────────────────
  const insightText = result.marketInsights.killerInsight
  if (insightText) {
    y += 12
    doc.setFillColor(255, 247, 237) // orange-50
    doc.setDrawColor(...ORANGE)
    doc.setLineWidth(0.3)

    const insightLines = doc.splitTextToSize(insightText, 160)
    const insightHeight = insightLines.length * 5 + 14
    doc.roundedRect(20, y, 170, insightHeight, 3, 3, 'FD')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...ORANGE)
    doc.text('KEY INSIGHT', 26, y + 7)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.text(insightLines, 26, y + 14)

    y += insightHeight + 10
  }

  // ── KPI Summary ─────────────────────────────────────────────────────
  y = addHeader(doc, y, 'Market Summary')

  const totalRevenue = result.competitors.reduce(
    (sum, c) => sum + c.revenueEstimate.monthlyRevenue,
    0
  )
  const avgRating =
    result.competitors.reduce((sum, c) => sum + c.product.rating, 0) / result.competitors.length

  const kpis = [
    ['Est. Market Revenue', `$${totalRevenue.toLocaleString()}/mo`],
    ['Avg Price', `$${result.marketInsights.averagePrice.toFixed(2)}`],
    ['Avg Rating', avgRating.toFixed(1)],
    ['Competition', result.marketInsights.competitionLevel.toUpperCase()],
    ['Products Analyzed', String(result.totalProducts)],
    ['Reviews Analyzed', String(result.totalReviews)],
  ]

  const kpiColWidth = 55
  kpis.forEach(([label, value], i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 20 + col * kpiColWidth
    const ky = y + row * 16

    doc.setFontSize(8)
    doc.setTextColor(...GRAY)
    doc.setFont('helvetica', 'normal')
    doc.text(label ?? '', x, ky)

    doc.setFontSize(12)
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'bold')
    doc.text(value ?? '', x, ky + 6)
  })

  y += 38

  // ── Competitor Table ────────────────────────────────────────────────
  y = checkPageBreak(doc, y, 40)
  y = addHeader(doc, y, 'Competitor Revenue Ranking')

  const sorted = [...result.competitors].sort(
    (a, b) => b.revenueEstimate.monthlyRevenue - a.revenueEstimate.monthlyRevenue
  )

  const tableBody = sorted.map((c, i) => [
    `#${i + 1}`,
    (c.isUserListing ? '★ ' : '') +
      c.product.title.substring(0, 45) +
      (c.product.title.length > 45 ? '...' : ''),
    c.product.price,
    String(c.product.rating),
    c.product.reviewCount.toLocaleString(),
    `$${c.revenueEstimate.monthlyRevenue.toLocaleString()}`,
    c.revenueEstimate.monthlySales.toLocaleString(),
  ])

  autoTable(doc, {
    startY: y,
    head: [['#', 'Product', 'Price', 'Rating', 'Reviews', 'Revenue/mo', 'Units/mo']],
    body: tableBody,
    theme: 'striped',
    headStyles: {
      fillColor: [...ORANGE],
      textColor: [...WHITE],
      fontSize: 7,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 7, textColor: [...DARK] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 60 },
      2: { cellWidth: 18 },
      3: { cellWidth: 14 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 22 },
    },
    margin: { left: 20, right: 20 },
    didParseCell: data => {
      // Highlight user listing row
      if (data.section === 'body') {
        const comp = sorted[data.row.index]
        if (comp?.isUserListing) {
          data.cell.styles.fillColor = [255, 247, 237] // orange-50
          data.cell.styles.fontStyle = 'bold'
        }
      }
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10

  // ── Purchase Criteria ───────────────────────────────────────────────
  y = checkPageBreak(doc, y, 40)
  y = addHeader(doc, y, 'Top Purchase Criteria')

  const criteriaBody = result.marketInsights.topCriteria.map((c, i) => [
    `#${i + 1}`,
    c.criterion,
    `${c.importance}%`,
    c.sentiment,
    String(c.mentions),
  ])

  autoTable(doc, {
    startY: y,
    head: [['#', 'Criterion', 'Importance', 'Sentiment', 'Mentions']],
    body: criteriaBody,
    theme: 'striped',
    headStyles: {
      fillColor: [...ORANGE],
      textColor: [...WHITE],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 8, textColor: [...DARK] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 70 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
    },
    margin: { left: 20, right: 20 },
    didParseCell: data => {
      if (data.section === 'body' && data.column.index === 3) {
        const val = data.cell.raw as string
        if (val === 'positive') data.cell.styles.textColor = [...GREEN]
        else if (val === 'negative') data.cell.styles.textColor = [220, 38, 38]
      }
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10

  // ── Market Opportunities ────────────────────────────────────────────
  y = checkPageBreak(doc, y, 50)
  y = addHeader(doc, y, 'Market Opportunities')

  result.marketInsights.opportunities.forEach((opp, i) => {
    y = checkPageBreak(doc, y, 15)

    doc.setFillColor(...ORANGE)
    doc.circle(25, y - 1.5, 3, 'F')
    doc.setFontSize(7)
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.text(String(i + 1), 24, y)

    doc.setFontSize(8)
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(opp, 150)
    doc.text(lines, 32, y)
    y += lines.length * 4 + 4
  })

  // ── Strengths & Weaknesses per Competitor ───────────────────────────
  y = checkPageBreak(doc, y, 40)
  y = addHeader(doc, y, 'Competitor Strengths & Weaknesses')

  sorted.slice(0, 5).forEach(comp => {
    y = checkPageBreak(doc, y, 30)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    const label =
      (comp.isUserListing ? '★ YOUR LISTING: ' : '') +
      comp.product.title.substring(0, 60) +
      (comp.product.title.length > 60 ? '...' : '')
    doc.text(label, 20, y)
    y += 5

    // Strengths
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GREEN)
    doc.text('Strengths:', 22, y)
    y += 4

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    comp.strengths.slice(0, 3).forEach(s => {
      y = checkPageBreak(doc, y, 8)
      const lines = doc.splitTextToSize(`• ${s}`, 155)
      doc.setFontSize(7)
      doc.text(lines, 24, y)
      y += lines.length * 3.5 + 1
    })

    // Weaknesses
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('Weaknesses:', 22, y)
    y += 4

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    comp.weaknesses.slice(0, 3).forEach(w => {
      y = checkPageBreak(doc, y, 8)
      const lines = doc.splitTextToSize(`• ${w}`, 155)
      doc.setFontSize(7)
      doc.text(lines, 24, y)
      y += lines.length * 3.5 + 1
    })

    y += 4
  })

  // ── Footer on every page ────────────────────────────────────────────
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Review Analytics by Pixii.ai | Page ${i} of ${totalPages} | ${new Date(result.generatedAt).toLocaleDateString()}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    )
  }

  // ── Save ────────────────────────────────────────────────────────────
  const filename = `review-analytics-${result.query.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
