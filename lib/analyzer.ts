const DEEPSEEK_BASE = "https://api.deepseek.com/v1"

export interface AnalysisResult {
  overallScore: number
  thinness: { score: number; details: string }
  originality: { score: number; details: string }
  dateAccuracy: { score: number; details: string; outdatedRefs: string[] }
  factuality: { score: number; details: string; suspiciousClaims: string[] }
  eeat: { score: number; details: string }
  summary: string
  improvements: string[]
}

export async function analyzeArticle(article: string, apiKey: string): Promise<AnalysisResult> {
  const system = `あなたはAI生成コンテンツの品質評価の専門家です。与えられた記事を以下の5軸で100点満点で評価し、JSON形式で返してください。

評価基準:
1. thinness (薄さ): 一般論の羅列か、具体的な情報があるか (25点満点)
2. originality (独自性): 実体験や固有の視点があるか (25点満点)
3. dateAccuracy (年号鮮度): 古い年号や期限切れ情報がないか (15点満点)
4. factuality (事実正確性): 検証可能な主張か、疑わしい記述はないか (20点満点)
5. eeat (経験・専門性・権威性・信頼性): Google EEAT基準を満たすか (15点満点)

出力形式:
{
  "overallScore": 数値(0-100),
  "thinness": { "score": 数値, "details": "説明(50字以内)" },
  "originality": { "score": 数値, "details": "説明(50字以内)" },
  "dateAccuracy": { "score": 数値, "details": "説明(50字以内)", "outdatedRefs": ["古い年号の具体例"] },
  "factuality": { "score": 数値, "details": "説明(50字以内)", "suspiciousClaims": ["疑わしい主張の具体例"] },
  "eeat": { "score": 数値, "details": "説明(50字以内)" },
  "summary": "総評(100字以内)",
  "improvements": ["改善提案1", "改善提案2", "改善提案3"]
}`

  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `以下の記事を分析してください。\n\n${article.slice(0, 8000)}` },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    }),
  })

  if (!res.ok) throw new Error(`DeepSeek API error ${res.status}`)
  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}
