"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

async function requireAdmin() {
  if (!supabaseConfigured()) throw new Error("Supabase not configured");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile || profile.role !== "admin") {
    redirect("/account");
  }

  return supabase;
}

export async function adjustCredits(formData: FormData) {
  const supabase = await requireAdmin();
  const userId = formData.get("user_id") as string;
  const change = parseInt(formData.get("change") as string, 10);
  const reason = (formData.get("reason") as string) || "Manual adjustment";

  if (!userId || !Number.isFinite(change) || change === 0) return;

  const { error } = await supabase.rpc("adjust_credits", {
    p_user_id: userId,
    p_change: change,
    p_reason: reason,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const orderId = formData.get("order_id") as string;
  const status = formData.get("status") as string;

  if (!orderId || !status) return;

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
