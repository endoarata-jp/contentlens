import { type NextRequest } from "next/server"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const session = await createCheckoutSession(email || undefined)
    const { url, id } = session
    return Response.json({ url, sessionId: id })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
