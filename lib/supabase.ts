import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getSubscription(userId: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single()
  return data
}

export async function getUsage(userId: string): Promise<{ count: number; reset_date: string } | null> {
  const { data } = await supabase
    .from("usage")
    .select("*")
    .eq("user_id", userId)
    .single()
  
  if (!data) return null
  
  // Reset if new month
  const now = new Date()
  if (new Date(data.reset_date) <= now) {
    await supabase.from("usage").update({ count: 0, reset_date: nextMonthDate() }).eq("user_id", userId)
    return { count: 0, reset_date: nextMonthDate() }
  }
  
  return data
}

export async function incrementUsage(userId: string) {
  const usage = await getUsage(userId)
  const nextDate = nextMonthDate()
  
  if (!usage) {
    await supabase.from("usage").insert({ user_id: userId, count: 1, reset_date: nextDate })
  } else {
    await supabase.from("usage").update({ count: usage.count + 1 }).eq("user_id", userId)
  }
}

export async function canUserAnalyze(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId)
  if (sub) return true // Pro/Business user
  
  const usage = await getUsage(userId)
  if (!usage) return true
  return usage.count < 3
}

function nextMonthDate(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString()
}
