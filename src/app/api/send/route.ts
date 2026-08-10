import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const subject = typeof data.get("_subject") === "string" && (data.get("_subject") as string).trim()
      ? (data.get("_subject") as string).trim()
      : "New Contact Form Message";

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
    const imageLinks = (data.get("image_links") as string) || "";
    const paymentTiming = (data.get("payment_timing") as string) || "";

    const lines: string[] = [];
    if (name) lines.push(`Name: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (company) lines.push(`Company: ${company}`);
    if (country) lines.push(`Country: ${country}`);
    if (services) lines.push(`Services: ${services}`);
    if (selectedServices) lines.push(`Services: ${selectedServices}`);
    if (imagePurpose) lines.push(`Image purpose: ${imagePurpose}`);
    if (turnaround) lines.push(`Turnaround: ${turnaround}`);
    if (fileFormat) lines.push(`File format: ${fileFormat}`);
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

    const transporter = buildTransporter();
    await transporter.sendMail({
      from: `"PathPixHub" <${SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email || undefined,
      subject,
      text: body,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Mail send error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}