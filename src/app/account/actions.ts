"use server";

import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function requestRevision(
  orderId: string,
  note: string,
  links: string[],
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseConfigured()) return { ok: false, error: "Account system not configured." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in first." };

  const cleanLinks = (links || [])
    .map((l) => l.trim())
    .filter((l) => /^https?:\/\//i.test(l));

  const parts = [note.trim()];
  if (cleanLinks.length > 0) {
    parts.push("", "Reference links:");
    parts.push(...cleanLinks.map((l) => `- ${l}`));
  }
  const fullNote = parts.join("\n").trim() || "No details provided";

  const { error } = await supabase.rpc("request_revision", {
    p_order_id: orderId,
    p_note: fullNote,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/account");
  revalidatePath("/account/orders");
  revalidatePath("/admin");
  return { ok: true };
}

export async function confirmQuote(orderId: string): Promise<{ ok: boolean; error?: string; orderRef?: string }> {
  if (!supabaseConfigured()) return { ok: false, error: "Account system not configured." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in first." };

  const { data, error } = await supabase.rpc("confirm_quote", { p_order_id: orderId });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/account");
  revalidatePath("/account/quotes");
  revalidatePath("/account/orders");
  revalidatePath("/account/billing");
  return { ok: true, orderRef: (data as string) || undefined };
}