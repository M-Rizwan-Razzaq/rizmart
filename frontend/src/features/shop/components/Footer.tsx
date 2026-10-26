import { useState, type FormEvent } from "react";
import { Link } from "@/lib/router";
import { Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { InstagramIcon, FacebookIcon, TrustpilotIcon } from "@/components/icons/BrandIcons";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useSubscribeNewsletterMutation } from "@/store/services/newsletterApi";
import { DEFAULT_BRAND_FORM, getBrandAddress } from "@/lib/brand";
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
  const atelier = getBrandAddress(brand?.atelier);

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
          : { type: "success", message: "Thank you for subscribing to RizMart updates." },
      );
    } catch {
      setStatus({ type: "error", message: "Subscription failed. Please try again." });
    }
  };

  return (
    <footer className="border-t border-border bg-background text-foreground">
      {/* Trust bar above footer links */}
      <div className="border-b border-border bg-secondary/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Truck className="h-6 w-6 text-primary shrink-0" />
            <div>
              <div className="text-xs font-bold tracking-wider uppercase">
                Free Shipping Over PKR 500
              </div>
              <div className="text-xs text-muted-foreground">Shipping charges appear in your cart</div>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
            <div>
              <div className="text-xs font-bold tracking-wider uppercase">Product Information</div>
              <div className="text-xs text-muted-foreground">Details shown on each product page</div>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <RotateCcw className="h-6 w-6 text-primary shrink-0" />
            <div>
              <div className="text-xs font-bold tracking-wider uppercase">Cash on Delivery</div>
              <div className="text-xs text-muted-foreground">Review the return policy before ordering</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 grid gap-10 md:grid-cols-4">
        {/* Brand overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/rizmart-mark.jpg"
              alt=""
              className="h-11 w-11 rounded-lg border border-border object-cover"
            />
            <div>
              <div className="font-display text-2xl tracking-tight font-extrabold text-foreground">
                {appName.toUpperCase()}
              </div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Bags &amp; backpacks
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Shop school bags, backpacks, laptop bags and travel bags. Check product details,
            availability and shipping charges before ordering.
          </p>
          <div className="flex gap-2.5 pt-2">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.trustpilot}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Review RizMart on Trustpilot"
              title="Review RizMart on Trustpilot"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-[#00b67a] transition-colors hover:border-primary hover:text-primary"
            >
              <TrustpilotIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-primary font-bold mb-4">
            Shop Bags
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">
                All Backpacks & Bags
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">
                Kids & School Bags
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">
                Laptop Backpacks
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">
                Travel & Duffel Bags
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">
                Everyday & Sports Bags
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-primary font-bold mb-4">
            Help & Customer Care
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
              <a
                href={`mailto:${contactEmail}`}
                className="break-all hover:text-primary transition-colors"
              >
                {contactEmail}
              </a>
            </li>
            <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
              <a
                href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}
                className="hover:text-primary transition-colors"
              >
                {contactPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{atelier}</span>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary transition-colors">
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-primary transition-colors">
                Refund & Return Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Promotions */}
        <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-primary font-bold mb-4">
            RizMart Updates
          </h4>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            Subscribe for product news and store offers.
          </p>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground text-xs tracking-wider px-4 py-2.5 rounded-lg uppercase font-bold shrink-0 hover:opacity-90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "…" : "Join"}
              </button>
            </div>
            {status.type && (
              <p
                className={`text-xs mt-1 ${
                  status.type === "success"
                    ? "text-primary"
                    : status.type === "info"
                      ? "text-muted-foreground"
                      : "text-red-300"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} {appName}. All Rights Reserved. Built for daily journeys.
      </div>
    </footer>
  );
}
