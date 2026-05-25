const DEEPSEEK_BASE = "https://api.deepseek.com/v1"

export interface FactCheckResult {
  claim: string
  verdict: "verified" | "unverified" | "false" | "opinion"
  evidence: string
  sources: { title: string; url: string; snippet: string }[]
}

export async function checkFacts(article: string, deepseekKey: string): Promise<FactCheckResult[]> {
  // Step 1: Extract factual claims from article
  const extractor = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${deepseekKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "次の記事から検証が必要な事実的主張を3〜5個抽出し、JSON配列で返してください。各主張は「誰が・いつ・何を・どのような数字で」という形式にしてください。\n\n出力: [\"主張1\", \"主張2\", ...]" },
        { role: "user", content: article.slice(0, 6000) },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    }),
  })

  if (!extractor.ok) return []
  const extracted = await extractor.json()
  const claims: string[] = JSON.parse(extracted.choices[0].message.content).claims || []

  // Step 2: Verify each claim using AI knowledge + reasoning
  const results: FactCheckResult[] = []
  
  for (const claim of claims.slice(0, 5)) {
    const verifier = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${deepseekKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: `あなたは事実確認の専門家です。以下の主張を検証し、JSONで返してください。
判定: "verified"(正しい), "unverified"(確認できない), "false"(誤り), "opinion"(意見)

{
  "verdict": "verified/unverified/false/opinion",
  "evidence": "判断の根拠(100字以内)",
  "sources": [{"title": "参考情報のタイトル", "url": "", "snippet": "関連する事実"}]
}` },
          { role: "user", content: claim },
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    })

    if (verifier.ok) {
      const data = await verifier.json()
      const result = JSON.parse(data.choices[0].message.content)
      results.push({ claim, ...result })
    }
  }

  return results
}

// Brave Search API fallback for factual verification
export async function braveSearch(query: string, apiKey: string): Promise<{ title: string; url: string; snippet: string }[]> {
  if (!apiKey || apiKey === "your-brave-api-key") return []
  
  try {
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=3`, {
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.web?.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.description || "",
    }))
  } catch {
    return []
  }
}
