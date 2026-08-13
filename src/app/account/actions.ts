"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function requestRevision(formData: FormData) {
  if (!supabaseConfigured()) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const orderId = formData.get("order_id") as string;
  const note = (formData.get("note") as string) || "";
  if (!orderId) return;

  const { error } = await supabase.rpc("request_revision", {
    p_order_id: orderId,
    p_note: note,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/account");
  revalidatePath("/admin");
}