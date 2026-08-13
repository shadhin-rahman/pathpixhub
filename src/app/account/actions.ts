"use server";

import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { sendAdminMail } from "@/lib/mail";

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

  try {
    const { data: orderRow } = await supabase
      .from("orders")
      .select("reference, order_reference, title, user_id")
      .eq("id", orderId)
      .maybeSingle<{ reference: string; order_reference: string; title: string | null; user_id: string }>();

    let customerEmail = "";
    if (orderRow?.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", orderRow.user_id)
        .maybeSingle<{ email: string }>();
      customerEmail = profile?.email ?? "";
    }

    const ref = orderRow?.order_reference || orderRow?.reference || orderId;
    await sendAdminMail(
      `Revision Requested — ${ref}`,
      `A customer has requested a revision.\n\nOrder: ${ref}${orderRow?.title ? ` — ${orderRow.title}` : ""}\n\nRevision note:\n${fullNote}${customerEmail ? `\n\nCustomer email: ${customerEmail}` : ""}`,
      customerEmail || undefined,
    );
  } catch (err: unknown) {
    console.error("Revision email failed:", err instanceof Error ? err.message : err);
  }

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