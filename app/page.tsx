"use client"

import { useState } from "react"

interface AnalysisResult {
  overallScore: number
  thinness: { score: number; details: string }
  originality: { score: number; details: string }
  dateAccuracy: { score: number; details: string; outdatedRefs: string[] }
  factuality: { score: number; details: string; suspiciousClaims: string[] }
  eeat: { score: number; details: string }
  summary: string
  improvements: string[]
}

interface FactCheckResult {
  claim: string
  verdict: "verified" | "unverified" | "false" | "opinion"
  evidence: string
  sources: { title: string; url: string; snippet: string }[]
}

const VERDICT_MAP: Record<string, { label: string; color: string }> = {
  verified: { label: "検証済", color: "bg-green-100 text-green-700" },
  unverified: { label: "未確認", color: "bg-yellow-100 text-yellow-700" },
  false: { label: "誤り", color: "bg-red-100 text-red-700" },
  opinion: { label: "意見", color: "bg-blue-100 text-blue-700" },
}

function ScoreBar({ label, score, max, details }: { label: string; score: number; max: number; details: string }) {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="text-zinc-500">{score}/{max} ({pct}%)</span>
      </div>
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-zinc-500">{details}</p>
    </div>
  )
}

export default function Home() {
  const [article, setArticle] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [facts, setFacts] = useState<FactCheckResult[]>([])
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"analysis" | "facts">("analysis")

  const analyze = async () => {
    if (!article) { setError("記事を入力してください"); return }
    setLoading(true)
    setError("")
    setAnalysis(null)
    setFacts([])

    try {
      const [aRes, fRes] = await Promise.all([
        fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ article }) }),
        fetch("/api/check-facts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ article }) }),
      ])
      const [aData, fData] = await Promise.all([aRes.json(), fRes.json()])
      if (aRes.ok && !aData.error) setAnalysis(aData)
      if (fRes.ok && Array.isArray(fData)) setFacts(fData)
      if (!aRes.ok && !fRes.ok) setError(aData.error || "分析に失敗しました")
    } catch {
      setError("リクエストに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const overallColor = (analysis?.overallScore || 0) >= 70 ? "text-green-600" : (analysis?.overallScore || 0) >= 40 ? "text-yellow-600" : "text-red-600"

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900">ContentLens</h1>
        <p className="mt-2 text-zinc-500">AI記事の品質を5軸で採点。独自性・EEAT・事実検証。</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6">
        <textarea
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          placeholder="分析したい記事をここに貼り付けてください..."
          rows={12}
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm mb-4"
        />
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "分析中..." : "品質を分析する"}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {analysis && (
        <>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6 text-center">
            <p className="text-sm text-zinc-500">総合スコア</p>
            <p className={`text-5xl font-bold ${overallColor}`}>{analysis.overallScore}</p>
            <p className="text-xs text-zinc-400">/100</p>
            <p className="mt-2 text-sm text-zinc-600">{analysis.summary}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab("analysis")} className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "analysis" ? "bg-violet-600 text-white" : "bg-white border border-zinc-200 text-zinc-600"}`}>品質分析</button>
            <button onClick={() => setActiveTab("facts")} className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "facts" ? "bg-violet-600 text-white" : "bg-white border border-zinc-200 text-zinc-600"}`}>事実検証 ({facts.length})</button>
          </div>

          {activeTab === "analysis" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <ScoreBar label="薄さ (情報の密度)" score={analysis.thinness.score} max={25} details={analysis.thinness.details} />
              <ScoreBar label="独自性 (固有の視点)" score={analysis.originality.score} max={25} details={analysis.originality.details} />
              <ScoreBar label="年号鮮度" score={analysis.dateAccuracy.score} max={15} details={analysis.dateAccuracy.details} />
              {analysis.dateAccuracy.outdatedRefs?.length > 0 && (
                <div className="mb-4 ml-4">
                  <p className="text-xs text-zinc-500 mb-1">検出された古い参照:</p>
                  {analysis.dateAccuracy.outdatedRefs.map((r, i) => <p key={i} className="text-xs text-red-600">⚠ {r}</p>)}
                </div>
              )}
              <ScoreBar label="事実正確性" score={analysis.factuality.score} max={20} details={analysis.factuality.details} />
              {analysis.factuality.suspiciousClaims?.length > 0 && (
                <div className="mb-4 ml-4">
                  <p className="text-xs text-zinc-500 mb-1">疑わしい記述:</p>
                  {analysis.factuality.suspiciousClaims.map((r, i) => <p key={i} className="text-xs text-red-600">⚠ {r}</p>)}
                </div>
              )}
              <ScoreBar label="EEAT (経験・専門性・権威性)" score={analysis.eeat.score} max={15} details={analysis.eeat.details} />

              <div className="mt-6 pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-700 mb-2">改善提案</h3>
                {analysis.improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span className="text-violet-600 mt-0.5">▶</span>
                    <p className="text-sm text-zinc-600">{imp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "facts" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              {facts.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-8">事実検証の結果はありません</p>
              ) : (
                facts.map((f, i) => (
                  <div key={i} className="mb-4 pb-4 border-b border-zinc-100 last:border-0">
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${VERDICT_MAP[f.verdict]?.color || ""}`}>
                        {VERDICT_MAP[f.verdict]?.label || f.verdict}
                      </span>
                      <p className="text-sm font-medium text-zinc-800">{f.claim}</p>
                    </div>
                    <p className="text-xs text-zinc-500 ml-1">{f.evidence}</p>
                    {f.sources.length > 0 && (
                      <div className="mt-1 ml-1">
                        {f.sources.map((s, j) => (
                          <a key={j} href={s.url} target="_blank" rel="noreferrer" className="block text-xs text-violet-600 hover:underline">
                            📎 {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {!analysis && !loading && (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-400">記事を貼り付けて「品質を分析する」をクリックしてください</p>
          <p className="mt-1 text-xs text-zinc-300">AIが5軸の品質スコア + 事実検証を提供します</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <p className="text-xs font-medium text-zinc-500">無料</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">¥0</p>
          <p className="text-xs text-zinc-400 mt-1">月3回まで</p>
        </div>
        <div className="rounded-xl border-2 border-violet-500 bg-white p-4 text-center relative">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] px-2 py-0.5 rounded-full">おすすめ</span>
          <p className="text-xs font-medium text-violet-600">プロ</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">¥980</p>
          <p className="text-xs text-zinc-400 mt-1">/月・無制限</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <p className="text-xs font-medium text-zinc-500">ビジネス</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">¥2,980</p>
          <p className="text-xs text-zinc-400 mt-1">/月・API利用可</p>
        </div>
      </div>
    </main>
  )
}
