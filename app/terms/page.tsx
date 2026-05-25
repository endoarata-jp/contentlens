"use client"

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">利用規約</h1>
      <div className="text-sm text-zinc-600 space-y-4 leading-relaxed">
        <p>本利用規約は、ContentLens（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意の上、本サービスを利用するものとします。</p>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">1. サービスの内容</h2>
        <p>本サービスは、AIを活用した日本語コンテンツの品質分析・事実検証を提供するWebサービスです。分析結果は参考情報であり、正確性を保証するものではありません。</p>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">2. 料金と支払い</h2>
        <p>無料プラン（月3回まで）および有料プラン（月額980円〜、回数無制限）があります。支払いはStripeを通じて処理され、月額自動更新となります。解約はいつでも可能で、解約月の末日までサービスを利用できます。</p>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">3. 禁止事項</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>本サービスの不正利用・APIの過剰なリクエスト</li>
          <li>他のユーザーや第三者の権利を侵害する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>アカウントの第三者への貸与・譲渡</li>
        </ul>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">4. 免責事項</h2>
        <p>本サービスの分析結果の正確性・完全性について保証しません。本サービスの利用により生じたいかなる損害についても、運営者は一切の責任を負いません。</p>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">5. 規約の変更</h2>
        <p>運営者は必要に応じて本規約を変更できるものとします。変更後の規約は本ページに掲載された時点で効力を生じます。</p>

        <p className="mt-8 text-xs text-zinc-400">制定日: 2026年5月25日</p>
      </div>
    </div>
  )
}
