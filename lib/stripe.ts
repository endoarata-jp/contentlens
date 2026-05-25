import Stripe from "stripe"

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil" as any,
  })
}

export function createProCheckout(email?: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripe未設定")
  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price_data: { currency: "jpy", product_data: { name: "ContentLens Pro", description: "月額980円・無制限分析" }, unit_amount: 980, recurring: { interval: "month" } }, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}?session_id={CHECKOUT_SESSION_ID}&status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}`,
    customer_email: email,
    metadata: { plan: "pro" },
  })
}

export function createBusinessCheckout(email?: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripe未設定")
  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price_data: { currency: "jpy", product_data: { name: "ContentLens Business", description: "月額2,980円・無制限分析 + APIアクセス" }, unit_amount: 2980, recurring: { interval: "month" } }, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}?session_id={CHECKOUT_SESSION_ID}&status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}`,
    customer_email: email,
    metadata: { plan: "business" },
  })
}

export async function createPortalSession(customerId: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripe未設定")
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}`,
  })
}