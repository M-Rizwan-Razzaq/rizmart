"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";

const buildFaqs = () => [
  {
    q: "How does Cash on Delivery (COD) work?",
    a: "Cash on delivery is available at checkout. Submit your order online and pay the courier when the parcel arrives.",
  },
  {
    q: "How much does shipping cost?",
    a: "Shipping is PKR 25 for an order subtotal of PKR 500 or less. Shipping is free when the subtotal is over PKR 500. The amount is shown in your cart before checkout.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "Please review the current Refund Policy page for return eligibility and timing. If a term is unclear, contact us before placing your order.",
  },
  {
    q: "Where can I find a bag's material and dimensions?",
    a: "Open the product page and check Specifications & Features. Only details supplied for that product are shown. Contact us if you need information that is not listed.",
  },
  {
    q: "Does a WhatsApp message place or confirm an order?",
    a: "No. A WhatsApp message is an inquiry about a product. RizMart must confirm availability and order details separately before an order is placed.",
  },
  {},
];

export default function FaqPage() {
  const { data: brand } = useGetBrandSettingsQuery();
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const faqs = buildFaqs();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-secondary min-h-screen py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <div className="text-xs font-bold tracking-widest uppercase text-gold mb-2">
            Help Center
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Answers about ordering, shipping charges, product details, and return policies at{" "}
            {appName}.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
              >
                <span className="font-display text-base sm:text-lg font-bold text-primary">
                  {f.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition-transform text-primary ${
                    open === i ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-4 sm:px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
