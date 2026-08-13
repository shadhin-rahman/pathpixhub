import nodemailer from "nodemailer";

const TO_EMAIL = process.env.TO_EMAIL || "pathpixhub@gmail.com";
const SMTP_USER = process.env.SMTP_USER || "pathpixhub@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "";

export function buildTransporter() {
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

export async function sendAdminMail(subject: string, text: string, replyTo?: string): Promise<boolean> {
  if (!SMTP_PASS) {
    console.warn("SMTP_PASS not configured — skipping email.");
    return false;
  }
  const transporter = buildTransporter();
  await transporter.sendMail({
    from: `"PathPixHub" <${SMTP_USER}>`,
    to: TO_EMAIL,
    replyTo,
    subject,
    text,
  });
  return true;
}