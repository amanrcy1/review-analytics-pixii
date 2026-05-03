'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Brain,
  AlertCircle,
  Clock,
  Trash2,
  Settings,
  X,
  Sliders,
  ArrowLeft,
} from 'lucide-react'
import { ResultsDashboard } from '@/src/features/analytics'
import { AnalysisResult } from '@/src/features/analytics/types'

// ─── History ────────────────────────────────────────────────────────────
interface HistoryEntry {
  id: string
  query: string
  timestamp: string
  result: AnalysisResult
}
const HISTORY_KEY = 'pixii-analysis-history'
const MAX_HISTORY = 10
function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}
function saveHistory(h: HistoryEntry[]) {
  if (typeof window !== 'undefined')
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)))
}

// ─── Loading Progress ───────────────────────────────────────────────────
const STEPS = [
  { label: 'Searching Amazon products', duration: 3000 },
  { label: 'Fetching product details', duration: 4000 },
  { label: 'Collecting customer reviews', duration: 5000 },
  { label: 'Running AI analysis', duration: 8000 },
  { label: 'Estimating revenue', duration: 2000 },
  { label: 'Generating insights', duration: 3000 },
]

function LoadingProgress({ query }: { query: string }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const total = STEPS.reduce((s, x) => s + x.duration, 0)
    let elapsed = 0
    const iv = setInterval(() => {
      elapsed += 100
      let se = 0,
        step = 0
      for (let i = 0; i < STEPS.length; i++) {
        const s = STEPS[i]!
        if (elapsed >= se + s.duration) {
          se += s.duration
          step = Math.min(i + 1, STEPS.length - 1)
        } else {
          step = i
          break
        }
      }
      setCurrentStep(step)
      setProgress(Math.min(95, (elapsed / total) * 100))
      if (elapsed >= total) clearInterval(iv)
    }, 100)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="mx-auto max-w-lg">
      <div className="card card-body" role="status" aria-live="polite">
        <div className="mb-6 flex items-center">
          <div className="loading-spinner mr-4 h-8 w-8 flex-shrink-0"></div>
          <div>
            <h3 className="font-medium text-gray-900">Analyzing &ldquo;{query}&rdquo;</h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {STEPS[currentStep]?.label ?? 'Processing'}...
            </p>
            <span className="sr-only">{STEPS[currentStep]?.label ?? 'Processing'}</span>
          </div>
        </div>
        <div
          className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Analysis progress"
        >
          <div
            className="h-2 rounded-full bg-orange-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="space-y-2">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {i < currentStep ? (
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : i === currentStep ? (
                <div className="loading-spinner h-4 w-4 flex-shrink-0"></div>
              ) : (
                <div className="h-4 w-4 flex-shrink-0 rounded-full bg-gray-200"></div>
              )}
              <span className={i <= currentStep ? 'text-gray-900' : 'text-gray-400'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Settings Panel ─────────────────────────────────────────────────────
function SettingsPanel({
  maxCompetitors,
  reviewPages,
  onSave,
  onClose,
}: {
  maxCompetitors: number
  reviewPages: number
  onSave: (mc: number, rp: number) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 h-full w-full overflow-y-auto border-l border-gray-200 bg-white shadow-2xl sm:w-96"
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
        onKeyDown={e => {
          if (e.key === 'Escape') onClose()
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-gray-700" />
            <h2 className="text-sm font-semibold text-gray-900">Settings</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-1" aria-label="Close settings">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div className="form-group">
            <label htmlFor="max-competitors" className="form-label">
              Max Competitors
            </label>
            <p className="mb-2 text-xs text-gray-500">Products to analyze per query</p>
            <select
              id="max-competitors"
              value={maxCompetitors}
              onChange={e => onSave(Number(e.target.value), reviewPages)}
              className="form-input"
            >
              <option value={3}>3 competitors</option>
              <option value={5}>5 competitors</option>
              <option value={9}>9 competitors (default)</option>
              <option value={12}>12 competitors</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="review-pages" className="form-label">
              Review Pages per Product
            </label>
            <p className="mb-2 text-xs text-gray-500">More pages = more reviews, more API calls</p>
            <select
              id="review-pages"
              value={reviewPages}
              onChange={e => onSave(maxCompetitors, Number(e.target.value))}
              className="form-input"
            >
              <option value={1}>1 page (~10 reviews)</option>
              <option value={3}>3 pages (~30 reviews)</option>
              <option value={5}>5 pages (~50 reviews)</option>
              <option value={10}>10 pages (~100 reviews)</option>
            </select>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <h4 className="mb-2 text-xs font-semibold text-orange-900">API Usage Estimate</h4>
            <div className="space-y-1 text-xs text-orange-800">
              <p>Reviews per query: ~{maxCompetitors * reviewPages * 10}</p>
              <p>API calls per query: ~{1 + maxCompetitors + maxCompetitors * reviewPages}</p>
              <p>
                Queries/month (free): ~
                {Math.floor(100 / (1 + maxCompetitors + maxCompetitors * reviewPages))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Shared Nav Bar ─────────────────────────────────────────────────────
function NavBar({
  history,
  onNewAnalysis,
  onSettingsClick,
  onHistoryToggle,
  showBack,
}: {
  history: HistoryEntry[]
  onNewAnalysis: () => void
  onSettingsClick: () => void
  onHistoryToggle: () => void
  showBack: boolean
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onNewAnalysis}
              className="btn-ghost -ml-1.5 p-1.5"
              aria-label="Back to new analysis"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              Review Analytics
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {history.length > 0 && (
            <button
              onClick={onHistoryToggle}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              <Clock className="h-4 w-4" />{' '}
              <span className="hidden sm:inline">History ({history.length})</span>
              <span className="text-xs sm:hidden">({history.length})</span>
            </button>
          )}
          <button
            onClick={onSettingsClick}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <Settings className="h-4 w-4" /> <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────
export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [maxCompetitors, setMaxCompetitors] = useState(9)
  const [reviewPages, setReviewPages] = useState(1)

  useEffect(() => {
    setHistory(loadHistory())
    try {
      const s = JSON.parse(localStorage.getItem('pixii-settings') || '{}')
      if (s.maxCompetitors) setMaxCompetitors(s.maxCompetitors)
      if (s.reviewPages) setReviewPages(s.reviewPages)
    } catch {
      /* ignore */
    }
  }, [])

  const saveSettingsLocal = (mc: number, rp: number) => {
    setMaxCompetitors(mc)
    setReviewPages(rp)
    localStorage.setItem('pixii-settings', JSON.stringify({ maxCompetitors: mc, reviewPages: rp }))
  }

  const addToHistory = useCallback(
    (result: AnalysisResult) => {
      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        query: result.query,
        timestamp: new Date().toISOString(),
        result,
      }
      const updated = [entry, ...history.filter(h => h.query !== result.query)].slice(
        0,
        MAX_HISTORY
      )
      setHistory(updated)
      saveHistory(updated)
    },
    [history]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!query.trim()) {
      setError('Please enter a product category or ASIN')
      return
    }
    setIsLoading(true)
    setAnalysisResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), maxCompetitors, reviewPages }),
      })
      if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`)
      const result = await res.json()
      setAnalysisResult(result)
      addToHistory(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsLoading(false)
    }
  }

  const goHome = () => {
    setAnalysisResult(null)
    setQuery('')
    setError('')
    setShowHistory(false)
  }

  const formatTime = (iso: string) => {
    const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`
    return `${Math.floor(diffHr / 24)}d ago`
  }

  const examples = [
    'magnesium supplements',
    'protein powder',
    'vitamin d3',
    'probiotics',
    'omega 3 fish oil',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Consistent Nav — always visible */}
      <NavBar
        history={history}
        onNewAnalysis={goHome}
        onSettingsClick={() => setShowSettings(true)}
        onHistoryToggle={() => {
          setShowHistory(!showHistory)
          setAnalysisResult(null)
          setIsLoading(false)
        }}
        showBack={!!analysisResult || isLoading || showHistory}
      />

      {/* Settings */}
      {showSettings && (
        <SettingsPanel
          maxCompetitors={maxCompetitors}
          reviewPages={reviewPages}
          onSave={saveSettingsLocal}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* ── HISTORY VIEW ── */}
      {showHistory && !analysisResult && !isLoading && (
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analysis History</h2>
          <p className="mb-8 mt-1 text-sm text-gray-500">
            Your recent analyses — click to view results
          </p>

          {history.length === 0 ? (
            <div className="py-16 text-center">
              <Clock className="mx-auto mb-4 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">No analyses yet. Run your first one!</p>
              <button onClick={goHome} className="btn-primary mt-4">
                New Analysis
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(entry => (
                <div
                  key={entry.id}
                  className="card card-body group flex items-center justify-between"
                >
                  <button
                    onClick={() => {
                      setAnalysisResult(entry.result)
                      setShowHistory(false)
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
                        <Search className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{entry.query}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {entry.result.totalProducts} products · {entry.result.totalReviews}{' '}
                          reviews · {formatTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      const updated = history.filter(h => h.id !== entry.id)
                      setHistory(updated)
                      saveHistory(updated)
                      if (updated.length === 0) setShowHistory(false)
                    }}
                    className="ml-4 p-2 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                    aria-label={`Remove ${entry.query} from history`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── LANDING / FORM ── */}
      {!analysisResult && !isLoading && !showHistory && (
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-12 text-center sm:px-6 sm:pb-16 sm:pt-20">
          <h1 className="animate-fade-in-up text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
            AI-powered Amazon
            <br />
            review analytics. <span className="text-orange-600">Instantly.</span>
          </h1>
          <p className="animate-fade-in-up mx-auto mt-6 max-w-xl text-lg text-gray-600 delay-100">
            Drop your ASIN or product category. Get competitor analysis, revenue estimates, and
            purchase criteria insights.
          </p>

          <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up mx-auto mt-10 max-w-xl delay-200"
          >
            <div className="flex flex-col items-stretch overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center">
                <div className="pl-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Enter Amazon ASIN or product category"
                  className="flex-1 border-0 bg-transparent px-3 py-4 text-base focus:outline-none focus:ring-0"
                  aria-invalid={error ? 'true' : undefined}
                  aria-describedby={error ? 'query-error' : undefined}
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="btn-primary rounded-none px-6 py-4 text-base sm:rounded-none sm:rounded-r-xl"
              >
                Analyze
              </button>
            </div>
            {error && (
              <div
                id="query-error"
                className="mt-3 flex items-center justify-center gap-2 text-sm text-red-600"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </form>

          <p className="animate-fade-in mt-4 text-sm text-gray-500 delay-300">
            Free to use. No credit card. Results in 30 seconds.
          </p>

          <div className="animate-fade-in delay-400 mt-6 flex flex-wrap justify-center gap-2">
            {examples.map(ex => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="animate-fade-in-up mt-16 grid grid-cols-2 gap-8 text-center delay-500 md:grid-cols-4">
            {[
              { icon: Target, label: 'Purchase Criteria', desc: 'What customers value' },
              { icon: DollarSign, label: 'Revenue Estimates', desc: 'Monthly sales data' },
              { icon: TrendingUp, label: 'Market Gaps', desc: 'Opportunities found' },
              { icon: Users, label: 'Competitor Intel', desc: 'Strengths & weaknesses' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i}>
                  <Icon className="mx-auto mb-2 h-6 w-6 text-orange-600" />
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {isLoading && (
        <div className="px-6 pt-20">
          <LoadingProgress query={query} />
        </div>
      )}

      {/* ── RESULTS (same layout, no sidebar) ── */}
      {analysisResult && (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="animate-fade-in-up mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {analysisResult.userAsin
                  ? `Your Listing vs. ${analysisResult.competitors.filter(c => !c.isUserListing).length} Competitors`
                  : `Analysis: ${analysisResult.query}`}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {analysisResult.userAsin && (
                  <span className="font-medium text-orange-600">
                    ASIN: {analysisResult.userAsin} ·{' '}
                  </span>
                )}
                {analysisResult.totalProducts} products · {analysisResult.totalReviews} reviews
                analyzed
              </p>
            </div>
            <button onClick={goHome} className="btn-primary text-sm">
              <Search className="mr-2 h-4 w-4" />
              New Analysis
            </button>
          </div>
          <ResultsDashboard result={analysisResult} />
        </div>
      )}
    </div>
  )
}
