import { useState, type FormEvent } from "react";
import { Link } from "@/lib/router";
import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/BrandIcons";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useSubscribeNewsletterMutation } from "@/store/services/newsletterApi";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  const { data: brand } = useGetBrandSettingsQuery();
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "info" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const contactEmail = brand?.contactEmail?.trim() || DEFAULT_BRAND_FORM.contactEmail;
  const contactPhone = brand?.contactPhone?.trim() || DEFAULT_BRAND_FORM.contactPhone;
  const atelier = brand?.atelier?.trim() || DEFAULT_BRAND_FORM.atelier;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    try {
      const result = await subscribeNewsletter({ email: normalized }).unwrap();
      setEmail("");
      setStatus(
        result.alreadySubscribed
          ? { type: "info", message: "You are already subscribed." }
          : { type: "success", message: "Thanks for subscribing." },
      );
    } catch (error) {
      setStatus({ type: "error", message: "Subscription failed. Please try again." });
    }
  };

  return (
    <footer className="mt-32 border-t border-border/60 bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl tracking-[0.2em] text-gold-gradient mb-4">
            {appName}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium bags designed for work, travel and everyday carry. Each piece is built with
            thoughtful structure and lasting detail.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-gold hover:border-gold"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-gold hover:border-gold"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm tracking-[0.2em] uppercase text-gold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-gold">
                All Bags
              </Link>
            </li>
            <li>
              <Link to="/shop">Laptop Bags</Link>
            </li>
            <li>
              <Link to="/shop">Backpacks</Link>
            </li>
            <li>
              <Link to="/shop">Travel Bags</Link>
            </li>
            <li>
              <Link to="/shop">Hand Bags</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm tracking-[0.2em] uppercase text-gold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {contactEmail}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {contactPhone}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {atelier}
            </li>
            <li>
              <Link to="/faq" className="hover:text-gold">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-gold">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-gold">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-gold">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm tracking-[0.2em] uppercase text-gold mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">
            First access to new arrivals and private offers.
          </p>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background/70 border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
                placeholder="Your email"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gold-gradient text-onyx text-xs tracking-[0.2em] px-4 uppercase font-medium disabled:opacity-50"
              >
                {isLoading ? "Joining…" : "Join"}
              </button>
            </div>
            {status.type && (
              <p
                className={`text-xs ${
                  status.type === "success"
                    ? "text-gold"
                    : status.type === "info"
                      ? "text-muted-foreground"
                      : "text-destructive"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground tracking-widest uppercase">
        © {new Date().getFullYear()} {appName} — All Rights Reserved
      </div>
    </footer>
  );
}
