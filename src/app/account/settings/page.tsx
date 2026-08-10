import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { ArrowLeft, User, Save } from "lucide-react";

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

        <div className="flex items-center gap-3 mb-8">
          <User className="w-6 h-6 text-[rgb(var(--accent-text))]" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
            Profile settings
          </h1>
        </div>

        <form action={updateProfile} className="glass-card rounded-3xl p-8 space-y-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={profile?.full_name ?? ""}
              placeholder="Your name"
              className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]">
              Email
            </label>
            <input
              type="email"
              readOnly
              value={user.email ?? ""}
              className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-subtle)]/50 border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb)/50%)] outline-none cursor-not-allowed"
            />
            <p className="mt-1.5 text-xs text-[rgb(var(--fg-rgb)/45%)]">
              Email is your login identifier and cannot be changed here.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            Save changes
          </button>
        </form>
      </div>
    </section>
  );
}
