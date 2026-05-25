import { type NextRequest } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature")!

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        console.log(`✓ Subscription completed: ${session.customer} - ${session.subscription}`)
        break
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        console.log(`✗ Subscription cancelled: ${subscription.customer}`)
        break
      }
    }

    return Response.json({ received: true })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}
