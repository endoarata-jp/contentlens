import { type NextRequest } from "next/server"
import { createPortalSession } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json()
    const session = await createPortalSession(customerId)
    return Response.json({ url: session.url })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
