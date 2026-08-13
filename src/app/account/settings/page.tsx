import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AccountSettings from "@/components/AccountSettings";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function SettingsPage() {
  if (!supabaseConfigured()) {
    return (
      <section className="pb-4">
        <div className="max-w-3xl">
          <div className="glass-card rounded-3xl p-10 text-center">
            <h1 className="text-3xl font-bold gradient-text">Account settings</h1>
            <p className="mt-4 text-[rgb(var(--fg-rgb)/60%)]">
              The account system is not connected yet. Add your Supabase keys to{" "}
              <code className="px-1.5 py-0.5 rounded bg-[rgb(var(--accent-500)/10%)] text-[rgb(var(--accent-text))]">.env.local</code>.
            </p>
          </div>
        </div>
      </section>
    );
  }

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

  const p = profile as Profile | null;
  const name = p?.full_name || user.email?.split("@")[0] || "Client";

  return (
    <section className="pb-4">
      <AccountSettings
        name={name}
        email={user.email ?? ""}
        role={p?.role ?? "customer"}
        memberSince={p?.created_at ? formatDate(p.created_at) : null}
      />
    </section>
  );
}