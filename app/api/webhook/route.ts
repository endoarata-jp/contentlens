import { type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature")!

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-03-31.basil" as any,
    })
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const customerEmail = session.customer_details?.email
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const plan = session.metadata?.plan || "pro"

        // Find user by email (they logged in before checkout)
        if (customerEmail) {
          const { data: users } = await supabase.auth.admin.listUsers()
          const user = users?.users?.find((u: any) => u.email === customerEmail)

          if (user) {
            // Upsert subscription
            await supabase.from("subscriptions").upsert({
              user_id: user.id,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan,
              status: "active",
            }, { onConflict: "user_id" })

            // Generate API key for Business plan
            if (plan === "business") {
              const { data: existingKey } = await supabase
                .from("api_keys")
                .select("id")
                .eq("user_id", user.id)
                .single()

              if (!existingKey) {
                await supabase.from("api_keys").insert({
                  user_id: user.id,
                  api_key: `cl_api_${crypto.randomUUID().replace(/-/g, "")}`,
                })
              }
            }
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id)

        if (!error) {
          // Disable API key on cancellation
          const { data: sub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", subscription.id)
            .single()

          if (sub) {
            await supabase.from("api_keys").update({ enabled: false }).eq("user_id", sub.user_id)
          }
        }
        break
      }
    }

    return Response.json({ received: true })
  } catch (e: any) {
    console.error("Webhook error:", e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
