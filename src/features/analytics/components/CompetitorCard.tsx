'use client'

import { useState } from 'react'
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronDown,
  ChevronUp,
  Crown,
} from 'lucide-react'
import { CompetitorAnalysis } from '../types'

interface CompetitorCardProps {
  competitor: CompetitorAnalysis
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const { product, revenueEstimate, strengths, weaknesses, isUserListing } = competitor
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`card relative ${
        isUserListing ? 'ring-2 ring-orange-500 border-orange-300 shadow-md' : ''
      }`}
    >
      {/* "Your Listing" badge */}
      {isUserListing && (
        <div className="absolute -top-3 left-4 z-10 flex items-center gap-1.5 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <Crown className="h-3 w-3" />
          Your Listing
        </div>
      )}

      {/* Product Header */}
      <div className={`card-body pb-4 ${isUserListing ? 'pt-6' : ''}`}>
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || '/api/placeholder/64/64'}
            alt={`Product image for ${product.title}`}
            width={64}
            height={64}
            className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 object-cover"
            onError={(e) => { e.currentTarget.src = '/api/placeholder/64/64' }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold text-gray-900" title={product.title}>
              {product.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                {product.rating}
              </span>
              <span>{product.reviewCount.toLocaleString()} reviews</span>
              <span className="font-semibold text-gray-900">{product.price}</span>
            </div>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700"
              aria-label={`View ${product.title} on Amazon (opens in new tab)`}
            >
              View on Amazon <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Revenue — compact row */}
      <div
        className={`grid grid-cols-3 gap-4 border-b border-t px-6 py-3 text-center ${
          isUserListing ? 'border-orange-100 bg-orange-50/60' : 'border-gray-100 bg-gray-50/80'
        }`}
      >
        <div>
          <p className="text-xs text-gray-500">Monthly Sales</p>
          <p className="text-sm font-semibold text-gray-900">
            {revenueEstimate.monthlySales.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="text-sm font-semibold text-emerald-600">
            ${revenueEstimate.monthlyRevenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Confidence</p>
          <p
            className={`text-sm font-semibold ${
              revenueEstimate.confidence === 'high'
                ? 'text-emerald-600'
                : revenueEstimate.confidence === 'medium'
                  ? 'text-amber-600'
                  : 'text-red-500'
            }`}
          >
            {revenueEstimate.confidence}
          </p>
        </div>
      </div>

      {/* Expandable Strengths/Weaknesses */}
      <div className="px-6 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-sm text-gray-600 hover:text-gray-900"
          aria-expanded={expanded}
          aria-controls={`strengths-weaknesses-${product.asin}`}
        >
          <span className="font-medium">Strengths & Weaknesses</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3" id={`strengths-weaknesses-${product.asin}`}>
            {strengths.length > 0 && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5" /> Strengths
                </p>
                <ul className="space-y-1">
                  {strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {weaknesses.length > 0 && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <TrendingDown className="h-3.5 w-3.5" /> Weaknesses
                </p>
                <ul className="space-y-1">
                  {weaknesses.slice(0, 3).map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-red-500"></span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
