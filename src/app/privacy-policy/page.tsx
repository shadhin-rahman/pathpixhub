import LegalPage from "@/components/LegalPage";

const sections = [
  {
    title: "Information We Collect",
    body: ["When you visit or use our services, we may collect:"],
    list: [
      "Personal Details: Name, email address, contact number, and other details provided through forms.",
      "Project Information: Files, images, and project requirements submitted for editing.",
      "Technical Data: IP address, browser type, and activity logs to improve website performance.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: ["We use the information to:"],
    list: [
      "Fulfill your requests for image editing and related services.",
      "Communicate about orders, offers, or updates.",
      "Enhance our website and services based on user feedback.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "Your data is securely stored and protected against unauthorized access. We do not share your files or personal information with third parties, except as required to deliver services or comply with legal obligations.",
    ],
  },
  {
    title: "Client Image Usage",
    list: [
      "Submitted Images: All images uploaded for paid services remain your property and will not be used elsewhere.",
      "Free Trial Images: With permission, these may be featured in our portfolio unless otherwise specified by you.",
    ],
  },
  {
    title: "Cookies and Tracking",
    body: [
      "We use cookies to enhance your browsing experience. Cookies help us analyze web traffic and personalize content. You can manage cookie preferences in your browser settings. For full details, please read our Cookie Policy.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "Our contact form is powered by Formspree, a third-party service that processes and delivers your inquiries to us. Formspree has its own privacy policy and does not use your data for any purpose other than relaying messages.",
    ],
  },
  {
    title: "External Links",
    body: [
      "Our website may contain links to third-party sites. We are not responsible for the privacy practices of these websites.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You can request to view, update, or delete your personal data by contacting us. We are committed to ensuring your data's accuracy and security.",
    ],
  },
  {
    title: "Updates to This Policy",
    body: [
      "We may update this Privacy Policy periodically. Any changes will be reflected on this page, and your continued use of the site signifies your agreement to these updates.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      effectiveDate="May 06, 2026"
      title={<>Privacy <span className="text-[#c7ea46]">Policy</span></>}
      intro="Protecting your privacy is our top priority. Here is how we collect, use, and safeguard your personal information when you interact with our website or use our services."
      contentsIntro="Browse the clauses below. Click any item to jump straight to that section."
      sections={sections}
      version="May 06, 2026 · v1.0"
      contactIntro="For questions about our Privacy Policy or how we handle your data, please email our team."
    />
  );
}
