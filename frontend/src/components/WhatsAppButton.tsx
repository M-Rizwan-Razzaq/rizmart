import { SOCIAL_LINKS } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${SOCIAL_LINKS.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
