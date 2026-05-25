import Stripe from "stripe"

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil" as any,
  })
}

export function createCheckoutSession(customerEmail?: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripeが設定されていません")

  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: { name: "ContentLens Pro" },
          unit_amount: 980,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}?session_id={CHECKOUT_SESSION_ID}&status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}`,
    customer_email: customerEmail,
    metadata: { plan: "pro" },
  })
}

export async function getSubscriptionStatus(sessionId: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripeが設定されていません")
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  })
  return {
    customerId: session.customer as string,
    subscriptionId: session.subscription as string,
    status: (session.subscription as any)?.status || "unknown",
  }
}

const FREE_LIMIT = 3

export interface UsageState {
  count: number
  resetDate: string
  subscription?: {
    customerId: string
    status: string
  }
}

export function getUsageFromToken(encryptedToken?: string | null): UsageState | null {
  if (!encryptedToken) return null
  try {
    const raw = Buffer.from(encryptedToken, "base64").toString("utf-8")
    const data = JSON.parse(raw) as UsageState & { sig: string }
    return data
  } catch {
    return null
  }
}

export function createToken(state: UsageState): string {
  const raw = JSON.stringify(state)
  return Buffer.from(raw).toString("base64")
}

export function canAnalyze(state: UsageState | null): boolean {
  if (!state) return true // First time user
  if (state.subscription?.status === "active") return true
  // Check free tier
  const now = new Date()
  const resetDate = new Date(state.resetDate)
  if (now >= resetDate) return true // New month
  return state.count < FREE_LIMIT
}

export function incrementUsage(state: UsageState | null): UsageState {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()

  if (!state || new Date(state.resetDate) <= now) {
    return { count: 1, resetDate: nextMonth }
  }

  return { ...state, count: state.count + 1 }
}
