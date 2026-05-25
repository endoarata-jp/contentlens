import { type NextRequest } from "next/server"
import { createProCheckout, createBusinessCheckout } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { email, plan } = await request.json()
    const session = plan === "business"
      ? await createBusinessCheckout(email || undefined)
      : await createProCheckout(email || undefined)
    return Response.json({ url: session.url, sessionId: session.id })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
