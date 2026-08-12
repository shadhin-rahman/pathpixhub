"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Mail,
  MailCheck,
  KeyRound,
  Save,
  ShieldCheck,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft as Back,
  MonitorSmartphone,
  LogOut,
  AtSign,
} from "lucide-react";

type Props = {
  name: string;
  email: string;
  role: string;
  memberSince: string | null;
};

type Alert = { type: "success" | "error"; text: string } | null;

const inputClass =
  "w-full px-5 py-4 rounded-2xl bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-[rgb(var(--fg-rgb))] placeholder:text-[rgb(var(--fg-rgb)/35%)] outline-none focus:border-[rgb(var(--accent-500)/60%)] transition-colors";

const primaryBtnClass =
  "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] font-bold hover:bg-[rgb(var(--accent-400))] transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed";

const labelClass =
  "block text-sm font-semibold mb-2 text-[rgb(var(--fg-rgb)/80%)]";

const tabClass = (active: boolean) =>
  `py-2.5 rounded-full text-sm font-bold transition-all ${
    active
      ? "bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))]"
      : "text-[rgb(var(--fg-rgb)/50%)] hover:text-[rgb(var(--fg-rgb))]"
  }`;

function initials(name: string, email: string) {
  const base = (name || email || "U").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (base[0] || "U").toUpperCase();
}

function AlertBanner({ alert }: { alert: Alert }) {
  if (!alert) return null;
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl px-5 py-4 text-sm border ${
        alert.type === "success"
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
          : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}
    >
      {alert.type === "success" ? (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      )}
      <span>{alert.text}</span>
    </div>
  );
}

export default function AccountSettings({ name, email, role, memberSince }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<"profile" | "security">("profile");
  const [fullName, setFullName] = useState(name);
  const isAdmin = role === "admin";

  const [newEmail, setNewEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  const [sessionBusy, setSessionBusy] = useState(false);
  const [otherSessionsSignedOut, setOtherSessionsSignedOut] = useState(false);

  const [alert, setAlert] = useState<Alert>(null);
  const [saveBusy, setSaveBusy] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);
    setSaveBusy(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setAlert({ type: "error", text: "Unable to verify your session. Please sign in again." });
      setSaveBusy(false);
      return;
    }

    const updates: { full_name: string; role?: string } = { full_name: fullName.trim() };
    if (isAdmin) updates.role = "admin";

    const updatesPromises: Promise<unknown>[] = [
      supabase.auth.updateUser({ data: { full_name: fullName.trim() } }),
    ];
    const profileUpdate = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (profileUpdate.error) {
      setAlert({ type: "error", text: profileUpdate.error.message });
      setSaveBusy(false);
      return;
    }
    await Promise.all(updatesPromises);

    setSaveBusy(false);
    setAlert({ type: "success", text: "Profile updated successfully." });
    router.refresh();
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);
    setEmailBusy(true);
    setEmailSent(false);

    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailBusy(false);
    if (error) {
      setAlert({ type: "error", text: error.message });
      return;
    }
    setNewEmail("");
    setEmailSent(true);
    setAlert({
      type: "success",
      text: "A confirmation link has been sent to your new email. Click it to finish updating your email address.",
    });
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);

    if (password.length < 6) {
      setAlert({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (password !== confirm) {
      setAlert({ type: "error", text: "New passwords do not match." });
      return;
    }

    setPasswordBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordBusy(false);
    if (error) {
      setAlert({ type: "error", text: error.message });
      return;
    }
    setPassword("");
    setConfirm("");
    setAlert({ type: "success", text: "Password updated successfully." });
  }

  async function handleSignOutOthers() {
    setAlert(null);
    setSessionBusy(true);
    const { error } = await supabase.auth.signOut({ scope: "others" });
    setSessionBusy(false);
    if (error) {
      setAlert({ type: "error", text: error.message });
      return;
    }
    setOtherSessionsSignedOut(true);
    setAlert({ type: "success", text: "Signed out all other sessions." });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.replace("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      <a
        href="/account"
        className="inline-flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent-text))] hover:underline mb-8"
      >
        <Back className="w-4 h-4" />
        Back to dashboard
      </a>

      {/* Profile header */}
      <div className="glass-card rounded-3xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative shrink-0 w-20 h-20 rounded-full bg-[rgb(var(--accent-500))] text-[rgb(var(--accent-contrast))] flex items-center justify-center text-2xl font-black">
            {initials(name, email)}
            {isAdmin && (
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[rgb(var(--bg-base,var(--bg)))] border border-[rgb(var(--accent-500)/40%)] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[rgb(var(--accent-text))]" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-text truncate">{name}</h1>
            <p className="mt-1 text-sm text-[rgb(var(--fg-rgb)/60%)] truncate">{email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] text-xs font-bold border border-[rgb(var(--accent-500)/25%)]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb)/60%)] text-xs font-bold border border-[rgb(var(--fg-rgb)/10%)]">
                  <User className="w-3.5 h-3.5" />
                  Customer
                </span>
              )}
              {memberSince && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[rgb(var(--fg-rgb)/60%)] text-xs font-bold border border-[rgb(var(--fg-rgb)/10%)]">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {memberSince}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 grid grid-cols-2 gap-1 rounded-full bg-[var(--bg-subtle)] p-1">
          <button type="button" onClick={() => setTab("profile")} className={tabClass(tab === "profile")}>
            Profile
          </button>
          <button type="button" onClick={() => setTab("security")} className={tabClass(tab === "security")}>
            Security &amp; Login
          </button>
        </div>
      </div>

      <div className="mb-6">
        <AlertBanner alert={alert} />
      </div>

      {tab === "profile" && (
        <div className="space-y-8">
          {/* Profile details */}
          <form onSubmit={handleSaveProfile} className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-[rgb(var(--accent-text))]" />
              <h2 className="text-xl font-bold">Profile details</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="full_name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              {isAdmin && (
                <div className="flex items-start gap-3 rounded-2xl bg-[rgb(var(--accent-500)/8%)] border border-[rgb(var(--accent-500)/20%)] px-5 py-4 text-sm text-[rgb(var(--fg-rgb)/70%)]">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[rgb(var(--accent-text))]" />
                  <div>
                    <p className="font-bold text-[rgb(var(--accent-text))]">Admin account</p>
                    <p className="mt-1">You have administrator privileges on {email}.</p>
                  </div>
                </div>
              )}

              <button type="submit" disabled={saveBusy} className={primaryBtnClass}>
                {saveBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save changes
              </button>
            </div>
          </form>

          {/* Email change */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-1">
              <AtSign className="w-5 h-5 text-[rgb(var(--accent-text))]" />
              <h2 className="text-xl font-bold">Email address</h2>
            </div>
            <p className="text-sm text-[rgb(var(--fg-rgb)/50%)] mb-6">
              You&apos;re currently signed in as <strong className="text-[rgb(var(--fg-rgb)/80%)]">{email}</strong>. Change it
              below — we&apos;ll email a confirmation link to the new address before it takes effect.
            </p>
            <form onSubmit={handleChangeEmail} className="space-y-5">
              <div>
                <label htmlFor="new_email" className={labelClass}>
                  New email
                </label>
                <input
                  id="new_email"
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              {emailSent && (
                <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-sm text-emerald-500">
                  <MailCheck className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Confirmation link sent. Please check the new inbox.</span>
                </div>
              )}
              <button type="submit" disabled={emailBusy} className={primaryBtnClass}>
                {emailBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Update email
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="space-y-8">
          {/* Change password */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-5 h-5 text-[rgb(var(--accent-text))]" />
              <h2 className="text-xl font-bold">Change password</h2>
            </div>
            <p className="text-sm text-[rgb(var(--fg-rgb)/50%)] mb-6">
              You&apos;re already signed in, so no need to re-enter your current password.
            </p>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label htmlFor="new_password" className={labelClass}>
                  New password
                </label>
                <input
                  id="new_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="confirm_password" className={labelClass}>
                  Confirm new password
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  className={inputClass}
                />
              </div>
              <button type="submit" disabled={passwordBusy} className={primaryBtnClass}>
                {passwordBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                Update password
              </button>
            </form>
          </div>

          {/* Sessions */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-1">
              <MonitorSmartphone className="w-5 h-5 text-[rgb(var(--accent-text))]" />
              <h2 className="text-xl font-bold">Active sessions</h2>
            </div>
            <p className="text-sm text-[rgb(var(--fg-rgb)/50%)] mb-6">
              You can sign out of every other device you&apos;re logged in to, or sign out everywhere.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSignOutOthers}
                disabled={sessionBusy || otherSessionsSignedOut}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--bg-subtle)] border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-[rgb(var(--accent-500)/50%)] transition-all disabled:opacity-60"
              >
                {sessionBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MonitorSmartphone className="w-4 h-4" />
                )}
                {otherSessionsSignedOut ? "Done — others signed out" : "Sign out other devices"}
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-[rgb(var(--fg-rgb)/10%)] text-sm font-bold hover:border-red-500/50 hover:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign out everywhere
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}