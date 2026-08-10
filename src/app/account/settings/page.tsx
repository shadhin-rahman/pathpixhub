import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { ArrowLeft, User, Save, ShieldCheck, Mail, Calendar, KeyRound } from "lucide-react";
import ChangePasswordForm from "@/components/ChangePasswordForm";

async function updateProfile(formData: FormData) {
  "use server";

  if (!supabaseConfigured()) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = (formData.get("full_name") as string) ?? "";

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/account");
}

function initials(name: string, email: string) {
  const base = (name || email || "U").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (base[0] || "U").toUpperCase();
}

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
      <section className="pt-40 pb-28 mesh-gradient min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card rounded-3xl p-10 text-center">
            <h1 className="text-3xl font-bold gradient-text">Profile settings</h1>
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
    <section className="pt-40 pb-28 mesh-gradient min-h-screen">
      <div className="max-w-2xl mx-auto px-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* Profile header */}
        <div className="glass-card rounded-3xl p-8 mb-8 flex items-center gap-5">
          <div className="shrink-0 w-20 h-20 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] flex items-center justify-center text-2xl font-black">
            {initials(p?.full_name ?? "", user.email ?? "")}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-text truncate">
              {name}
            </h1>
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/60%)] truncate">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {p?.role === "admin" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] text-xs font-bold border border-[rgb(var(--accent-500)/25%)]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgb(var(--bg-subtle))] text-[rgb(var(--fg-rgb)/60%)] text-xs font-bold border border-[rgb(var(--fg-rgb)/10%)]">
                  <User className="w-3.5 h-3.5" />
                  Customer
                </span>
              )}
              {p?.created_at && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgb(var(--bg-subtle))] text-[rgb(var(--fg-rgb)/60%)] text-xs font-bold border border-[rgb(var(--fg-rgb)/10%)]">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {formatDate(p.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile details */}
        <form action={updateProfile} className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            <h2 className="text-xl font-bold">Profile details</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={p?.full_name ?? ""}
                placeholder="Your name"
                className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
                <Mail className="w-4 h-4 text-[rgb(var(--fg-rgb)/40%)]" />
                Email address
              </label>
              <input
                type="email"
                readOnly
                value={user.email ?? ""}
                className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-subtle)]/50 border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb)/50%)] outline-none cursor-not-allowed"
              />
              <p className="mt-1.5 text-xs text-[rgb(var(--fg-rgb)/45%)]">
                Your email is your login identifier and cannot be changed here.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
            >
              <Save className="w-4 h-4" />
              Save changes
            </button>
          </div>
        </form>

        {/* Password change */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-5 h-5 text-[rgb(var(--accent-text))]" />
            <h2 className="text-xl font-bold">Change password</h2>
          </div>
          <p className="text-sm text-[rgb(var(--fg-rgb)/50%)] mb-6">
            Verify your current password first, then choose a new one.
          </p>
          <ChangePasswordForm email={user.email ?? ""} />
        </div>
      </div>
    </section>
  );
}
