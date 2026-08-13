import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/login`);
}

// Next.js prefetches <Link> targets with a GET. If this handler ran on GET, a
// viewport prefetch of the sign-out link would sign the user out immediately.
// Both account and admin pages now POST to this route, so GET only exists to
// make prefetches harmless.
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
