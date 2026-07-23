"use client";

export default function WhatsAppChat() {
  const phone = "8801723735896";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us"
      className="fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full bg-[#c7ea46] text-black flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 animate-[bounce_2s_ease-in-out_infinite] hover:shadow-[#c7ea46/50%] hover:shadow-2xl"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </a>
  );
}
