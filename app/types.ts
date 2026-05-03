// Re-export all types from the single source of truth.
// NOTE: lib/ modules import directly from src/features/analytics/types.
// This file exists only for convenience in app/ route handlers.
export type {
  ProductData,
  ReviewData,
  PurchaseCriteria,
  RevenueEstimate,
  CompetitorAnalysis,
  MarketInsight,
  AnalysisResult,
} from '../src/features/analytics/types'
