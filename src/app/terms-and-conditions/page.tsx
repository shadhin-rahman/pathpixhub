import { services } from "@/data/services";

const sections = [
  {
    title: "2. Acceptance of Terms",
    body: [
      "By placing an order or using our services:",
    ],
    list: [
      "You confirm that you are authorized to engage in the transaction on behalf of yourself or your organization.",
      "You agree to provide complete and accurate information.",
      "You agree to adhere to these Terms in their entirety.",
    ],
  },
  {
    title: "3. User Obligations",
    body: ["When using PathPixHub, you must:"],
    list: [
      "Provide Ownership Proof: Ensure you own or have permission to use any images or materials submitted to us.",
      "Respect Copyright Laws: Refrain from submitting content that infringes on third-party intellectual property rights.",
      "Avoid Unlawful Content: Do not submit images containing illegal, offensive, or inappropriate content.",
    ],
    footer: "Failure to comply with these obligations may result in the rejection of your project or suspension of services.",
  },
  {
    title: "4. Order Placement Process",
    body: ["To place an order, follow these steps:"],
    list: [
      "Contact us via email, WhatsApp, or the website form with your project details.",
      "Receive a custom quotation based on your requirements.",
      "Confirm the quotation and proceed with payment as agreed.",
      "Receive the final delivery within the specified timeline.",
    ],
  },
  {
    title: "5. Pricing and Payment",
    list: [
      "Quotations: Pricing is based on the complexity, volume, and type of service requested. Custom quotes are provided for bulk orders.",
      "Currency: Payments are accepted in US Dollar.",
      "Payment Methods: We accept Bank transfers and Payoneer.",
      "Refund Policy: Refunds are processed only for service cancellation before work commencement, or failure to deliver the agreed service after multiple revisions.",
    ],
  },
  {
    title: "6. Turnaround Time and Delivery",
    body: [
      "We prioritize timely delivery without compromising quality. Typical turnaround times depend on the complexity of the project and the number of images submitted.",
      "Urgent Delivery Requests: Rush services may be available for an additional fee. Contact us for details.",
    ],
  },
  {
    title: "7. Revisions Policy",
    body: ["We offer free revisions for minor adjustments within the scope of the original request."],
    list: [
      "Revision requests must be submitted within 10 days of receiving the final delivery.",
      "Additional charges may apply for significant changes or new requests outside the original brief.",
    ],
  },
  {
    title: "8. Intellectual Property Rights",
    list: [
      "You retain full ownership of your original images.",
      "Edited images provided by PathPixHub are your property upon final payment.",
      "PathPixHub may use completed projects for portfolio or promotional purposes unless you request otherwise in writing.",
    ],
  },
  {
    title: "9. Confidentiality and Data Security",
    body: ["We are committed to safeguarding your data."],
    list: [
      "Confidentiality: Your images and project details are kept private and will not be shared with third parties without your consent.",
      "Data Security: All files are handled on secure servers to prevent unauthorized access.",
    ],
  },
  {
    title: "10. Limitations of Liability",
    body: ["PathPixHub will not be held responsible for:"],
    list: [
      "Indirect or consequential losses resulting from delays or errors in the delivered work.",
      "Issues arising from unclear instructions or miscommunication.",
      "Technical issues beyond our control, such as internet outages or software failures.",
    ],
  },
  {
    title: "11. Cancellation Policy",
    list: [
      "Before work begins: Full refund available.",
      "After work begins: Partial refund may be issued depending on the progress made.",
    ],
  },
  {
    title: "12. Modifications to Terms and Conditions",
    body: [
      "We reserve the right to amend these Terms at any time. Updates will be posted on our website, and it is your responsibility to review them periodically. Continued use of our services constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "13. Third-Party Applications",
    body: [
      "PathPixHub is integrated with third-party applications, websites, and services, including but not limited to Shopify, PayPal, BrickFTP, Heroku, HelpScout, Smile.io, and Stripe (\"Third-Party Applications\"), to make available content, products, and/or services to you. These Third-Party Applications may have their own terms and conditions of use and privacy policies, and your use of them will be governed by and subject to such terms. You understand and agree that PathPixHub does not endorse and is not responsible or liable for the behavior, features, or content of any Third-Party Application or for any transaction you may enter into with its provider.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="pt-40 pb-16 mesh-gradient">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xs uppercase font-mono tracking-[0.4em] text-[rgb(var(--accent-400))] font-bold mb-6">Legal</h2>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Terms &amp; Conditions</h1>
          <p className="mt-4 text-sm text-[rgb(var(--fg-rgb)/40%)]">Last Updated: October 10, 2024</p>
          <p className="mt-6 text-lg text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
            Welcome to PathPixHub! These Terms and Conditions outline the rules and regulations for using our website
            and services. By accessing or using PathPixHub&apos;s services, you agree to comply with these Terms.
          </p>
        </div>
      </section>

      <section className="pb-32 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">1. Overview of Services</h2>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              PathPixHub provides professional photo editing services tailored to the needs of e-commerce businesses,
              photographers, marketers, and other industries. Our offerings include:
            </p>
            <ol className="mt-3 space-y-1.5 text-sm text-[rgb(var(--fg-rgb)/60%)] list-decimal list-inside">
              {services.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ol>
            <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">
              Each service is customized to meet your requirements, ensuring quality and satisfaction.
            </p>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-bold text-[rgb(var(--fg-rgb))]">{s.title}</h2>
              {s.body?.map((p, i) => (
                <p key={i} className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-3 space-y-2 text-sm text-[rgb(var(--fg-rgb)/60%)] list-disc list-inside">
                  {s.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {s.footer && (
                <p className="mt-3 text-[rgb(var(--fg-rgb)/60%)] leading-relaxed">{s.footer}</p>
              )}
            </div>
          ))}

          <div className="glass-card rounded-2xl p-6 border-[rgb(var(--fg-rgb)/5%)]">
            <h2 className="text-lg font-bold text-[rgb(var(--fg-rgb))]">14. Contact Us</h2>
            <p className="mt-2 text-sm text-[rgb(var(--fg-rgb)/60%)]">
              If you have any questions concerning our services or these Terms, please contact us at{" "}
              <a href="mailto:info@pathpixhub.com" className="text-[rgb(var(--accent-400))] hover:text-[rgb(var(--accent-300))]">
                info@pathpixhub.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
