import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AccountSidebar from "./account-sidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!supabaseConfigured()) redirect("/login");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const founderPromise = (async () => {
    try {
      await supabase.rpc("promote_founder");
    } catch { /* founder already promoted or not founder */ }
  })();

  const [{ data: profile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>(),
    founderPromise,
  ]);

  const role = profile?.role ?? "customer";

  return (
    <section className="pt-36 lg:pt-40 pb-28 mesh-gradient min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-10 items-start">
          <AccountSidebar role={role} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}