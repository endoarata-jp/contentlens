"use client"

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">プライバシーポリシー</h1>
      <div className="text-sm text-zinc-600 space-y-4 leading-relaxed">
        <p>本プライバシーポリシーは、ContentLens（以下「本サービス」）におけるユーザーの個人情報の取扱いについて定めるものです。</p>
        
        <h2 className="text-base font-semibold text-zinc-800 mt-6">1. 収集する情報</h2>
        <p>本サービスでは、アカウント登録時にメールアドレス、およびStripeを通じた決済情報を収集します。記事分析の内容自体は保存されず、品質スコア算出後ただちに破棄されます。</p>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">2. 情報の利用目的</h2>
        <p>収集した情報は以下の目的で利用します：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>本サービスの提供・運営のため</li>
          <li>ユーザーからのお問い合わせ対応のため</li>
          <li>利用料金の請求・決済処理のため</li>
          <li>サービス改善のための分析</li>
        </ul>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">3. 第三者提供</h2>
        <p>法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。決済処理はStripe社に委託しており、同社のプライバシーポリシーが適用されます。</p>

        <h2 className="text-base font-semibold text-zinc-800 mt-6">4. お問い合わせ</h2>
        <p>本ポリシーに関するお問い合わせは X: @sio_rises までご連絡ください。</p>

        <p className="mt-8 text-xs text-zinc-400">制定日: 2026年5月25日</p>
      </div>
    </div>
  )
}
