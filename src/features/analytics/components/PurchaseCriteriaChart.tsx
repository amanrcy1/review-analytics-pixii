'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { PurchaseCriteria } from '../types'

interface PurchaseCriteriaChartProps {
  criteria: PurchaseCriteria[]
}

// Shorten long labels for chart axis
function shortenLabel(label: string, max: number = 18): string {
  return label.length > max ? label.substring(0, max) + '…' : label
}

// Sentiment to color
function sentimentColor(s: string): string {
  if (s === 'positive') return '#059669'
  if (s === 'negative') return '#dc2626'
  return '#6b7280'
}

export function PurchaseCriteriaChart({ criteria }: PurchaseCriteriaChartProps) {
  const chartData = criteria.map(c => ({
    name: shortenLabel(c.criterion),
    fullName: c.criterion,
    importance: c.importance,
    mentions: c.mentions,
    sentiment: c.sentiment,
  }))

  return (
    <div className="space-y-6" aria-label="Purchase criteria importance chart">
      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-sm font-semibold text-gray-900">Purchase Criteria by Importance</h3>
          <p className="text-sm text-gray-500 mt-1">
            Key factors that influence customer purchasing decisions
          </p>
        </div>
        <div className="card-body">
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  angle={-40}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  interval={0}
                />
                <YAxis
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Importance']}
                  labelFormatter={(label) => {
                    const item = chartData.find(d => d.name === label)
                    return item?.fullName || label
                  }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Bar dataKey="importance" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.sentiment === 'negative' ? '#fca5a5' : '#ea580c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Criteria Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map((criterion, index) => (
          <div key={index} className="card card-body">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className="text-sm font-semibold text-gray-900">{criterion.criterion}</h4>
              <span className={`status-badge flex-shrink-0 ${
                criterion.sentiment === 'positive' ? 'status-success' :
                criterion.sentiment === 'negative' ? 'status-error' :
                'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
              }`}>
                {criterion.sentiment}
              </span>
            </div>
            
            {/* Importance bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Importance</span>
                <span className="font-semibold text-gray-900">{criterion.importance}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${criterion.importance}%`,
                    backgroundColor: sentimentColor(criterion.sentiment),
                  }}
                ></div>
              </div>
            </div>

            {/* Mentions */}
            <p className="text-xs text-gray-500 mb-3">
              {criterion.mentions} mentions across reviews
            </p>

            {/* Example quotes */}
            {criterion.examples.length > 0 && (
              <div className="space-y-1.5">
                {criterion.examples.slice(0, 2).map((example, i) => (
                  <p key={i} className="text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded-lg">
                    &ldquo;{example}&rdquo;
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
