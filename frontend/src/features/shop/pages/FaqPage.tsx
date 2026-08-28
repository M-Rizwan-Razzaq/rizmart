"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";

const buildFaqs = (appName: string) => [
  {
    q: "What is your return policy?",
    a: "You may return any unused bag within 30 days for a full refund. Custom or monogrammed orders are final sale.",
  },
  {
    q: "Is shipping insured?",
    a: "Yes. All orders ship insured, signature-required, at no additional cost.",
  },
  {
    q: "Do you offer a warranty?",
    a: `Every ${appName} bag carries a lifetime workmanship warranty covering stitching, seams and hardware defects.`,
  },
  {
    q: "Are your materials ethically sourced?",
    a: "We use durable materials like leather, canvas, nylon and reinforced linings selected for everyday carry.",
  },
  {
    q: "Can I request a custom bag?",
    a: "Yes. Contact our team to discuss monogramming, bulk orders or custom sizing.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept Cash on Delivery. Additional methods are coming soon.",
  },
];

export default function FaqPage() {
  const { data: brand } = useGetBrandSettingsQuery();
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const faqs = buildFaqs(appName);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12 sm:mb-16">
        <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Answers</div>
        <h1 className="font-display text-4xl sm:text-5xl">Frequently Asked</h1>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="border border-border/60">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
            >
              <span className="font-display text-base sm:text-lg">{f.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform ${open === i ? "rotate-180 text-gold" : ""}`}
              />
            </button>
            {open === i && <div className="px-4 sm:px-5 pb-5 text-muted-foreground">{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
