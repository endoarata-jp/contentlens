import { type NextRequest } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature")!

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-03-31.basil" as any,
    })
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
