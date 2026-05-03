'use client'

import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import {
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Target,
  Download,
  Crown,
  Zap,
  FileText,
} from 'lucide-react'
import { AnalysisResult } from '../types'
import { CompetitorCard } from './CompetitorCard'
import { MarketInsights } from './MarketInsights'

const PurchaseCriteriaChart = lazy(() =>
  import('./PurchaseCriteriaChart').then(m => ({ default: m.PurchaseCriteriaChart }))
)

interface ResultsDashboardProps {
  result: AnalysisResult
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'criteria' | 'insights'>(
    'overview'
  )

  // Separate user listing from competitors
  const userListing = useMemo(
    () => result.competitors.find(c => c.isUserListing),
    [result.competitors]
  )
  const competitorsOnly = useMemo(
    () => result.competitors.filter(c => !c.isUserListing),
    [result.competitors]
  )
  const hasUserListing = !!userListing

  // Sort: user listing first, then competitors by revenue desc
  const sortedCompetitors = useMemo(() => {
    const sorted = [...competitorsOnly].sort(
      (a, b) => b.revenueEstimate.monthlyRevenue - a.revenueEstimate.monthlyRevenue
    )
    return userListing ? [userListing, ...sorted] : sorted
  }, [userListing, competitorsOnly])

  const totalMarketRevenue = result.competitors.reduce(
    (sum, comp) => sum + comp.revenueEstimate.monthlyRevenue,
    0
  )

  const averageRating =
    result.competitors.reduce((sum, comp) => sum + comp.product.rating, 0) /
    result.competitors.length

  const exportData = () => {
    const dataStr = JSON.stringify(result, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analysis-${result.query.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    {
      id: 'competitors',
      label: hasUserListing ? 'Your Listing vs Competitors' : 'Competitors',
      icon: Users,
    },
    { id: 'criteria', label: 'Purchase Criteria', icon: Target },
    { id: 'insights', label: 'Market Insights', icon: Star },
  ] as const

  // Static delay classes so Tailwind JIT can detect them
  const kpiDelays = ['delay-100', 'delay-200', 'delay-300', 'delay-400'] as const

  const kpis = [
    {
      label: 'Est. Market Revenue',
      value: `$${totalMarketRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconColor: 'text-green-600 bg-green-50',
    },
    {
      label: hasUserListing ? 'Competitors' : 'Products',
      value: hasUserListing ? competitorsOnly.length : result.competitors.length,
      icon: Users,
      iconColor: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'Avg Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      iconColor: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Key Criteria',
      value: result.marketInsights.topCriteria.length,
      icon: Target,
      iconColor: 'text-purple-600 bg-purple-50',
    },
  ]

  // For the overview revenue table, show user listing with a label
  const revenueRanked = useMemo(() => {
    const sorted = [...result.competitors].sort(
      (a, b) => b.revenueEstimate.monthlyRevenue - a.revenueEstimate.monthlyRevenue
    )
    // In ASIN mode, ensure user's listing is always visible even if not top revenue
    if (hasUserListing) {
      const userInTop = sorted.slice(0, 10).some(c => c.isUserListing)
      if (!userInTop) {
        const user = sorted.find(c => c.isUserListing)
        if (user) {
          return [...sorted.slice(0, 9), user]
        }
      }
    }
    return sorted.slice(0, 10)
  }, [result.competitors, hasUserListing])

  const exportPdf = useCallback(async () => {
    const { generatePdfReport } = await import('./PdfReportGenerator')
    generatePdfReport(result)
  }, [result])

  return (
    <div className="space-y-6">
      {/* Export buttons — top right */}
      <div className="flex justify-end gap-2">
        <button
          onClick={exportPdf}
          className="btn-primary text-sm"
          aria-label="Download PDF report"
        >
          <FileText className="mr-2 h-4 w-4" />
          Download PDF Report
        </button>
        <button
          onClick={exportData}
          className="btn-secondary text-sm"
          aria-label="Export analysis data as JSON"
        >
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </button>
      </div>

      {/* ── Killer Insight Banner ── */}
      {result.marketInsights.killerInsight && (
        <div className="animate-fade-in-up rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500 shadow-sm">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Key Market Insight
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-800">
                {result.marketInsights.killerInsight}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Your Listing summary banner (only when ASIN mode) */}
      {userListing && (
        <div className="animate-fade-in-up card border-orange-200 bg-gradient-to-r from-orange-50 to-white">
          <div className="card-body">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 shadow-sm">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                    Your Listing
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                    {userListing.product.title}
                  </p>
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-6 text-center sm:gap-8">
                <div>
                  <p className="text-xs text-gray-500">Your Revenue</p>
                  <p className="text-lg font-bold text-emerald-600">
                    ${userListing.revenueEstimate.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Rating</p>
                  <p className="text-lg font-bold text-gray-900">
                    <Star className="-mt-0.5 mr-1 inline h-4 w-4 text-yellow-500" />
                    {userListing.product.rating}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">vs. Competitors</p>
                  <p className="text-lg font-bold text-orange-600">{competitorsOnly.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div key={i} className={`card card-body animate-count-up ${kpiDelays[i]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                    {kpi.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${kpi.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="scrollbar-thin overflow-x-auto border-b border-gray-200">
        <nav className="-mb-px flex min-w-max space-x-4 sm:space-x-6" role="tablist">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                id={`tab-${tab.id}`}
                className={`flex items-center border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'rounded-t-lg border-orange-600 bg-orange-50 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-semibold text-gray-900">
                  {hasUserListing
                    ? 'Revenue Ranking — You vs. Competitors'
                    : 'Top Competitors by Revenue'}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {revenueRanked.map((competitor, index) => (
                  <div
                    key={competitor.product.asin}
                    className={`flex items-center justify-between px-6 py-3 ${
                      competitor.isUserListing
                        ? 'border-l-2 border-l-orange-500 bg-orange-50/60'
                        : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-6 text-sm font-bold text-gray-400">#{index + 1}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="max-w-[240px] truncate text-sm font-medium text-gray-900">
                            {competitor.product.title}
                          </p>
                          {competitor.isUserListing && (
                            <span className="flex-shrink-0 rounded bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                              You
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          <Star className="-mt-0.5 inline h-3 w-3 text-yellow-500" />{' '}
                          {competitor.product.rating} ·{' '}
                          {competitor.product.reviewCount.toLocaleString()} reviews
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        ${competitor.revenueEstimate.monthlyRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {competitor.revenueEstimate.monthlySales.toLocaleString()} units/mo
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-semibold text-gray-900">Market Opportunities</h3>
              </div>
              <div className="card-body space-y-3">
                {result.marketInsights.opportunities
                  .slice(0, 5)
                  .map((opportunity: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-700">{opportunity}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {sortedCompetitors.map(competitor => (
              <CompetitorCard key={competitor.product.asin} competitor={competitor} />
            ))}
          </div>
        )}

        {activeTab === 'criteria' && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner h-8 w-8"></div>
              </div>
            }
          >
            <PurchaseCriteriaChart criteria={result.marketInsights.topCriteria} />
          </Suspense>
        )}

        {activeTab === 'insights' && <MarketInsights insights={result.marketInsights} />}
      </div>
    </div>
  )
}
