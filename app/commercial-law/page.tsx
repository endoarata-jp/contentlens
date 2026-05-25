"use client"

export default function CommercialLawPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">特定商取引法に基づく表記</h1>
      <div className="text-sm text-zinc-600 space-y-4 leading-relaxed">
        <div className="grid grid-cols-[120px_1fr] gap-3">
          <p className="font-semibold text-zinc-700">販売業者</p>
          <p>Arata</p>

          <p className="font-semibold text-zinc-700">運営責任者</p>
          <p>Arata</p>

          <p className="font-semibold text-zinc-700">所在地</p>
          <p>ご請求があれば遅滞なく開示します（contact@endoarata.jp）</p>

          <p className="font-semibold text-zinc-700">連絡先</p>
          <p>contact@endoarata.jp</p>

          <p className="font-semibold text-zinc-700">販売価格</p>
          <p>プロプラン: 月額980円（税込）<br/>ビジネスプラン: 月額2,980円（税込）</p>

          <p className="font-semibold text-zinc-700">支払方法</p>
          <p>クレジットカード（Stripe決済）</p>

          <p className="font-semibold text-zinc-700">支払時期</p>
          <p>契約時および毎月の自動更新時</p>

          <p className="font-semibold text-zinc-700">サービス提供時期</p>
          <p>決済完了後即時に利用可能</p>

          <p className="font-semibold text-zinc-700">返品・解約</p>
          <p>デジタルサービスの性質上、返金は原則お受けしておりません。解約はいつでも可能で、解約月の末日までサービスを利用できます。</p>

          <p className="font-semibold text-zinc-700">動作環境</p>
          <p>最新のWebブラウザ（Chrome / Firefox / Safari / Edge）</p>
        </div>

        <p className="mt-8 text-xs text-zinc-400">制定日: 2026年5月25日</p>
      </div>
    </div>
  )
}
