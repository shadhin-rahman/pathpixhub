import LegalPage from "@/components/LegalPage";

const sections = [
  {
    title: "Introduction",
    body: [
      "Welcome to PathPixHub! These Terms and Conditions (\"Terms\") outline the rules and regulations for using our website and services. By accessing or using PathPixHub's services, you agree to comply with these Terms. If you do not agree with any part of these Terms, please do not use our services.",
    ],
  },
  {
    title: "Overview of Services",
    body: [
      "PathPixHub provides professional photo editing services tailored to the needs of e-commerce businesses, photographers, marketers, and other industries. Our offerings include:",
    ],
    list: [
      "Clipping Path & Multi Clipping Path",
      "Background Removal",
      "Image Masking",
      "Shadow Creation",
      "Ghost Mannequin",
      "Color Change",
      "Photo Retouching",
      "Car Image Editing",
      "E-commerce Image Editing",
    ],
    footer: "Each service is customized to meet your requirements, ensuring quality and satisfaction.",
  },
  {
    title: "Acceptance of Terms",
    body: ["By placing an order or using our services:"],
    list: [
      "You confirm that you are authorized to engage in the transaction on behalf of yourself or your organization.",
      "You agree to provide complete and accurate information.",
      "You agree to adhere to these Terms in their entirety.",
    ],
  },
  {
    title: "User Obligations",
    body: ["When using PathPixHub, you must:"],
    list: [
      "Provide Ownership Proof: Ensure you own or have permission to use any images or materials submitted to us.",
      "Respect Copyright Laws: Refrain from submitting content that infringes on third-party intellectual property rights.",
      "Avoid Unlawful Content: Do not submit images containing illegal, offensive, or inappropriate content.",
    ],
    footer: "Failure to comply with these obligations may result in the rejection of your project or suspension of services.",
  },
  {
    title: "Order Placement Process",
    body: ["To place an order, follow these steps:"],
    list: [
      "Contact us via email, WhatsApp, or the website form with your project details.",
      "Receive a custom quotation based on your requirements.",
      "Confirm the quotation and proceed with payment as agreed.",
      "Receive the final delivery within the specified timeline.",
    ],
  },
  {
    title: "Pricing and Payment",
    list: [
      "Quotations: Pricing is based on the complexity, volume, and type of service requested. Custom quotes are provided for bulk orders.",
      "Currency: Payments are accepted in US Dollar.",
      "Payment Methods: We accept Bank transfers and Payoneer.",
      "Refund Policy: Refunds are processed only for service cancellation before work commencement, or failure to deliver the agreed service after multiple revisions.",
    ],
  },
  {
    title: "Turnaround Time and Delivery",
    body: [
      "We prioritize timely delivery without compromising quality. Typical turnaround times depend on the complexity of the project and the number of images submitted.",
      "Urgent Delivery Requests: Rush services may be available for an additional fee. Contact us for details.",
    ],
  },
  {
    title: "Revisions Policy",
    body: ["We offer free revisions for minor adjustments within the scope of the original request."],
    list: [
      "Revision requests must be submitted within 10 days of receiving the final delivery.",
      "Additional charges may apply for significant changes or new requests outside the original brief.",
    ],
  },
  {
    title: "Intellectual Property Rights",
    list: [
      "You retain full ownership of your original images.",
      "Edited images provided by PathPixHub are your property upon final payment.",
      "PathPixHub may use completed projects for portfolio or promotional purposes unless you request otherwise in writing.",
    ],
  },
  {
    title: "Confidentiality and Data Security",
    body: ["We are committed to safeguarding your data."],
    list: [
      "Confidentiality: Your images and project details are kept private and will not be shared with third parties without your consent.",
      "Data Security: All files are handled on secure servers to prevent unauthorized access.",
    ],
  },
  {
    title: "Limitations of Liability",
    body: ["PathPixHub will not be held responsible for:"],
    list: [
      "Indirect or consequential losses resulting from delays or errors in the delivered work.",
      "Issues arising from unclear instructions or miscommunication.",
      "Technical issues beyond our control, such as internet outages or software failures.",
    ],
  },
  {
    title: "Cancellation Policy",
    list: [
      "Before work begins: Full refund available.",
      "After work begins: Partial refund may be issued depending on the progress made.",
    ],
  },
  {
    title: "Modifications to Terms and Conditions",
    body: [
      "We reserve the right to amend these Terms at any time. Updates will be posted on our website, and it is your responsibility to review them periodically. Continued use of our services constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "Third-Party Applications",
    body: [
      "PathPixHub is integrated with third-party applications, websites, and services, including but not limited to Shopify, PayPal, BrickFTP, Heroku, HelpScout, Smile.io, and Stripe (\"Third-Party Applications\"), to make available content, products, and/or services to you. These Third-Party Applications may have their own terms and conditions of use and privacy policies, and your use of them will be governed by and subject to such terms. You understand and agree that PathPixHub does not endorse and is not responsible or liable for the behavior, features, or content of any Third-Party Application or for any transaction you may enter into with its provider.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      effectiveDate="May 06, 2026"
      title={<><span className="block">Terms &amp;</span><span className="block text-white">Conditions</span></>}
      intro="Please review these Terms and Conditions carefully before using this website and all related services from PathPixHub. If you do not agree to all clauses, you should stop using the site immediately."
      contentsIntro="Browse the clauses below. Click any item to jump straight to that section."
      sections={sections}
      version="May 06, 2026 · v1.0"
      contactIntro="Email our team and we will respond as soon as possible."
    />
  );
}
