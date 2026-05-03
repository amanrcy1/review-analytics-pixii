import { NextRequest, NextResponse } from 'next/server'
import { analyzeAmazonCategory } from '../../../lib/amazon-analyzer'

export async function POST(request: NextRequest) {
  try {
    const { query, maxCompetitors, reviewPages } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // Server-side clamping to prevent API quota abuse
    const config = {
      maxCompetitors: Math.min(
        Math.max(1, Number(maxCompetitors) || Number(process.env.MAX_COMPETITORS) || 9),
        15
      ),
      reviewPages: Math.min(
        Math.max(1, Number(reviewPages) || Number(process.env.REVIEW_PAGES_PER_PRODUCT) || 1),
        10
      ),
    }

    console.warn(
      `Starting analysis for query: ${query} (competitors: ${config.maxCompetitors}, reviewPages: ${config.reviewPages})`
    )

    const result = await analyzeAmazonCategory(query.trim(), config)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)

    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Amazon Review Analytics API - Use POST to analyze' },
    { status: 200 }
  )
}
