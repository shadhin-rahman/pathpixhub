import LegalPage from "@/components/LegalPage";

const sections = [
  {
    title: "What Are Cookies",
    body: [
      "Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work efficiently, improve your browsing experience, and provide information to the owners of the site.",
    ],
  },
  {
    title: "How We Use Cookies",
    body: ["We use cookies and similar technologies to:"],
    list: [
      "Remember your preferences and settings during your visit.",
      "Understand how visitors use our website so we can improve performance.",
      "Keep track of your cookie consent choices.",
      "Enable core website functionality and security features.",
    ],
  },
  {
    title: "Types of Cookies We Use",
    list: [
      "Essential Cookies: Required for the website to function properly. These cannot be switched off.",
      "Preference Cookies: Allow the website to remember choices you make, such as theme selection.",
      "Analytics Cookies: Help us understand how visitors interact with our site so we can measure and improve performance.",
      "Marketing Cookies: May be used to show relevant content and measure campaign effectiveness.",
    ],
  },
  {
    title: "Your Cookie Choices",
    body: [
      "When you first visit our website, we show you a cookie consent banner. By clicking \"Accept\", you consent to the use of cookies described in this policy. You can withdraw or change your consent at any time by clearing your browser cookies.",
      "You can also manage or block cookies directly through your browser settings. Most browsers allow you to refuse cookies or alert you when a cookie is being sent.",
    ],
  },
  {
    title: "Third-Party Cookies",
    body: [
      "Some cookies may be set by third-party services we use, such as analytics or chat providers. These third parties have their own privacy policies. We do not control these cookies and are not responsible for their practices.",
    ],
  },
  {
    title: "Updates to This Policy",
    body: [
      "We may update this Cookie Policy periodically. Any changes will be reflected on this page, and your continued use of the site signifies your agreement to these updates.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      effectiveDate="May 06, 2026"
      title={<><span className="block">Cookie</span><span className="block text-white">Policy</span></>}
      intro="This Cookie Policy explains what cookies are, how PathPixHub uses them, and how you can manage your preferences when you visit our website."
      contentsIntro="Browse the sections below. Click any item to jump straight to that section."
      sections={sections}
      version="May 06, 2026 · v1.0"
      contactIntro="For questions about our Cookie Policy or how we use cookies, please email our team."
    />
  );
}
