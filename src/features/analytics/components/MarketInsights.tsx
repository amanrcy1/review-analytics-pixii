'use client'

import { TrendingUp, Target, DollarSign, BarChart3, Lightbulb } from 'lucide-react'
import { MarketInsight, PurchaseCriteria } from '../types'

interface MarketInsightsProps {
  insights: MarketInsight
}

export function MarketInsights({ insights }: MarketInsightsProps) {
  const competitionConfig = {
    low: {
      label: 'Low',
      color: 'status-success',
      desc: 'Room for new entrants with differentiated products',
    },
    medium: {
      label: 'Medium',
      color: 'status-warning',
      desc: 'Requires strong positioning and unique value props',
    },
    high: {
      label: 'High',
      color: 'status-error',
      desc: 'Focus on niche segments or significant innovation',
    },
  }
  const comp = competitionConfig[insights.competitionLevel] ?? competitionConfig.medium

  return (
    <div className="space-y-6">
      {/* Market Overview — 3 compact metric cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Price Point</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                ${insights.averagePrice.toFixed(2)}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <DollarSign className="h-4.5 w-4.5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Competition Level</p>
              <span className={`status-badge mt-1.5 ${comp.color}`}>{comp.label}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <BarChart3 className="h-4.5 w-4.5 text-orange-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">{comp.desc}</p>
        </div>

        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Top Criteria</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {insights.topCriteria.length}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
              <Target className="h-4.5 w-4.5 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Key purchase decision factors identified</p>
        </div>
      </div>

      {/* Purchase Criteria — compact list */}
      <div className="card">
        <div className="card-header">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Target className="h-4 w-4 text-orange-600" />
            Most Important Purchase Criteria
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {insights.topCriteria.slice(0, 6).map((criterion: PurchaseCriteria, index: number) => (
            <div key={index} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{criterion.criterion}</p>
                  <p className="text-xs text-gray-500">{criterion.mentions} mentions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`status-badge ${
                    criterion.sentiment === 'positive'
                      ? 'status-success'
                      : criterion.sentiment === 'negative'
                        ? 'status-error'
                        : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
                  }`}
                >
                  {criterion.sentiment}
                </span>
                <span className="w-10 text-right text-sm font-semibold text-orange-600">
                  {criterion.importance}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Opportunities */}
      <div className="card">
        <div className="card-header">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Market Opportunities
          </h3>
        </div>
        <div className="card-body space-y-3">
          {insights.opportunities.map((opportunity: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <p className="text-sm text-gray-700">{opportunity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations — clean, consistent cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Strategic Recommendations
          </h3>
        </div>
        <div className="card-body space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-1 text-sm font-semibold text-gray-900">Product Positioning</h4>
            <p className="text-sm text-gray-600">
              Focus on the top 3 purchase criteria:{' '}
              {insights.topCriteria
                .slice(0, 3)
                .map((c: PurchaseCriteria) => c.criterion)
                .join(', ')}
              . These are the highest-weighted factors in customer purchase decisions.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-1 text-sm font-semibold text-gray-900">Pricing Strategy</h4>
            <p className="text-sm text-gray-600">
              Average market price is ${insights.averagePrice.toFixed(2)}. Consider positioning
              10-15% above or below based on your value proposition and target customer segment.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-1 text-sm font-semibold text-gray-900">Market Entry</h4>
            <p className="text-sm text-gray-600">
              With {insights.competitionLevel} competition,{' '}
              {insights.competitionLevel === 'low'
                ? 'move quickly to capture market share with strong fundamentals.'
                : insights.competitionLevel === 'medium'
                  ? 'differentiate through unique value propositions and superior customer experience.'
                  : 'target underserved niche segments or introduce breakthrough innovation.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
