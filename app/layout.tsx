import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ContentLens - AIコンテンツ品質チェッカー",
  description: "AIが日本語記事の薄さ・独自性・EEAT・事実正確性を5軸で採点。年号チェック・事実検証付き。",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-zinc-50 antialiased">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-3">
            <a href="/" className="text-lg font-bold text-violet-600">ContentLens</a>
            <span className="text-xs text-zinc-400">AIコンテンツ品質チェッカー</span>
          </div>
        </header>
        {children}
        <footer className="border-t border-zinc-200 bg-white mt-12 py-4 text-center text-[10px] text-zinc-400">
          <div className="flex justify-center gap-3">
            <a href="/privacy" className="hover:text-zinc-600">プライバシーポリシー</a>
            <a href="/terms" className="hover:text-zinc-600">利用規約</a>
            <a href="/commercial-law" className="hover:text-zinc-600">特定商取引法に基づく表記</a>
          </div>
          <p className="mt-1">© 2026 ContentLens</p>
        </footer>
      </body>
    </html>
  )
}
