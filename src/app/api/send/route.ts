import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { formatOrderRef, isOrderRef } from "@/lib/orderRef";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Order } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO_EMAIL = process.env.TO_EMAIL || "pathpixhub@gmail.com";
const SMTP_USER = process.env.SMTP_USER || "pathpixhub@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "";

function buildTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function nextQuoteNumber(supabase?: SupabaseClient | null): Promise<number | null> {
  try {
    if (!supabase || !supabaseConfigured()) return null;
    const { data, error } = await supabase.rpc("next_quote_no");
    if (error || typeof data !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const message = (data.get("message") as string) || "";
    const country = (data.get("country") as string) || "";
    const company = (data.get("company") as string) || "";
    const services = (data.get("services") as string) || "";
    const selectedServices = (data.get("selected_services") as string) || "";
    const imagePurpose = (data.get("image_purpose") as string) || "";
    const turnaround = (data.get("turnaround") as string) || "";
    const quoteDetails = (data.get("quote_details") as string) || "";
    const fileFormat = (data.get("file_format") as string) || "";
    const existingClipping = (data.get("existing_clipping") as string) || "";
    const colorReferenceLinks = (data.get("color_reference_links") as string) || "";
    const imageLinks = (data.get("image_links") as string) || "";
    const paymentTiming = (data.get("payment_timing") as string) || "";
    const imageCountRaw = (data.get("image_count") as string) || "";
    const estimatedTotal = (data.get("estimated_total") as string) || "";

    const isQuote = Boolean(quoteDetails || services || selectedServices);
    // The server is the single source of truth for the sequential quote number
    // (Q1001, Q1002, …) so no two submissions ever collide.
    let orderRef = (data.get("order_ref") as string) || "";
    const supabase = supabaseConfigured() ? await createClient() : null;
    const nextNumber = await nextQuoteNumber(supabase);
    if (nextNumber) orderRef = formatOrderRef(nextNumber);
    else if (!isOrderRef(orderRef)) orderRef = "Q0";

    const subject = `New ${isQuote ? "Quote" : "Contact"} Request — ${orderRef}`;

    const lines: string[] = [];
    lines.push(`Order/Quote reference: ${orderRef}`);
    if (name) lines.push(`Name: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (company) lines.push(`Company: ${company}`);
    if (country) lines.push(`Country: ${country}`);
    if (services) lines.push(`Services: ${services}`);
    if (selectedServices) lines.push(`Services: ${selectedServices}`);
    if (imagePurpose) lines.push(`Image purpose: ${imagePurpose}`);
    if (turnaround) lines.push(`Turnaround: ${turnaround}`);
    if (fileFormat) lines.push(`File format: ${fileFormat}`);
    if (existingClipping) lines.push(`Existing clipping path: ${existingClipping}`);
    if (colorReferenceLinks) lines.push(`Color reference links: ${colorReferenceLinks}`);
    if (imageCountRaw) lines.push(`Image count: ${imageCountRaw}`);
    if (estimatedTotal) lines.push(`Estimated total: $${estimatedTotal}`);
    if (imageLinks) lines.push(`Image links:\n${imageLinks}`);
    if (paymentTiming) {
      const timingLabel = paymentTiming === "now" ? "Pay Now (immediately)" : paymentTiming === "7" ? "Within 7 days" : paymentTiming === "15" ? "Within 15 days" : "Monthly installments";
      lines.push(`Payment timing: ${timingLabel}`);
    }
    if (quoteDetails) {
      lines.push("");
      lines.push("=== QUOTE DETAILS ===");
      lines.push(quoteDetails);
      lines.push("=====================");
    }
    if (message) {
      lines.push("");
      lines.push("=== MESSAGE ===");
      lines.push(message);
      lines.push("================");
    }
    const body = lines.join("\n").trim() || "(no message content)";

    const attachments: { filename: string; contentType?: string; content: Buffer }[] = [];
    const uploads = data.getAll("images").filter((v): v is File => v instanceof File && typeof File !== "undefined");
    for (const file of uploads.slice(0, 10)) {
      attachments.push({
        filename: file.name || "image.jpg",
        contentType: file.type || "image/jpeg",
        content: Buffer.from(await file.arrayBuffer()),
      });
    }
    if (attachments.length > 0) {
      lines.push(`Attachments: ${attachments.length} file(s) — also saved in Supabase Storage under the "client-uploads" bucket / "supporting" folder (if upload succeeded).`);
    }

    const transporter = buildTransporter();
    await transporter.sendMail({
      from: `"PathPixHub" <${SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email || undefined,
      subject,
      text: body,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // If a logged-in customer placed an order, save it so it appears in their
    // /account dashboard.
    let order: Partial<Order> | null = null;
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const title =
          (data.get("order_title") as string) || (selectedServices || services || "Photo editing order");
        const imageCount = Math.max(0, parseInt(imageCountRaw, 10) || 0);
        const { data: inserted, error } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            reference: orderRef,
            title,
            description: quoteDetails || message || "",
            service: selectedServices || services || "",
            image_count: imageCount,
            credit_cost: 0,
            status: "pending",
          })
          .select("*")
          .single<Order>();

        if (error) {
          console.error("Order insert error:", error.message);
        } else {
          order = inserted;
        }
      }
    }

    return NextResponse.json({ ok: true, order_ref: orderRef, order_id: order?.id ?? null });
  } catch (err: unknown) {
    console.error("Mail send error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
