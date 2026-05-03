// Unified types — must match the API response from lib/amazon-analyzer.ts

export interface ProductData {
  asin: string
  title: string
  price: string
  rating: number
  reviewCount: number
  bsr: number
  category: string
  imageUrl: string
  url: string
}

export interface ReviewData {
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
}

export interface PurchaseCriteria {
  criterion: string
  importance: number
  sentiment: 'positive' | 'negative' | 'neutral'
  mentions: number
  examples: string[]
}

export interface RevenueEstimate {
  dailySales: number
  monthlySales: number
  monthlyRevenue: number
  confidence: 'high' | 'medium' | 'low'
  method: string
}

export interface CompetitorAnalysis {
  product: ProductData
  reviews: ReviewData[]
  purchaseCriteria: PurchaseCriteria[]
  revenueEstimate: RevenueEstimate
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  isUserListing?: boolean
}

export interface MarketInsight {
  topCriteria: PurchaseCriteria[]
  averagePrice: number
  totalMarketRevenue: number
  competitionLevel: 'low' | 'medium' | 'high'
  opportunities: string[]
  killerInsight?: string
}

export interface AnalysisResult {
  query: string
  category: string
  totalProducts: number
  totalReviews: number
  competitors: CompetitorAnalysis[]
  marketInsights: MarketInsight
  generatedAt: string
  userAsin?: string
}
