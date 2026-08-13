import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Order, CreditTransaction } from "@/lib/types";
import AdminPanel from "./admin-panel";

export default async function AdminPage() {
  if (!supabaseConfigured()) {
    redirect("/account");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!myProfile || myProfile.role !== "admin") {
    redirect("/account");
  }

  const [{ data: profiles }, { data: orders }, { data: transactions }] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("credit_transactions").select("*").order("created_at", { ascending: false }).limit(30),
    ]);

  return (
    <section className="pt-40 pb-28 mesh-gradient min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <AdminPanel
          profiles={(profiles ?? []) as Profile[]}
          orders={(orders ?? []) as Order[]}
          transactions={(transactions ?? []) as CreditTransaction[]}
        />
      </div>
    </section>
  );
}