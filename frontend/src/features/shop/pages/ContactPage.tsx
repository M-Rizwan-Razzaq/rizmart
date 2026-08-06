"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useSendContactMessageMutation } from "@/store/services/contactApi";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";

export default function ContactPage() {
  const { data: brand } = useGetBrandSettingsQuery();
  const [sendMessage, { isLoading }] = useSendContactMessageMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const contactEmail = brand?.contactEmail?.trim() || DEFAULT_BRAND_FORM.contactEmail;
  const contactPhone = brand?.contactPhone?.trim() || DEFAULT_BRAND_FORM.contactPhone;
  const atelier = brand?.atelier?.trim() || DEFAULT_BRAND_FORM.atelier;

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      }).unwrap();
      toast.success("Your message has been sent.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("We couldn't send your message right now.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12 sm:mb-16">
        <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Get in Touch</div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">Contact {appName}</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        <div className="space-y-6">
          {[
            { i: Mail, t: "Email", v: contactEmail },
            { i: Phone, t: "Phone", v: contactPhone },
            { i: MapPin, t: "Atelier", v: atelier },
          ].map((c) => (
            <div key={c.t} className="flex items-start gap-4 border border-border/60 p-5 sm:p-6">
              <c.i className="h-5 w-5 text-gold mt-1 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-1">
                  {c.t}
                </div>
                <div className="break-words">{c.v}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Name"
            className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
          />
          <input
            required
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="Phone number"
            className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
          />
          <input
            required
            value={form.subject}
            onChange={(e) => setField("subject", e.target.value)}
            placeholder="Subject"
            className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
          />
          <textarea
            required
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            placeholder="Message"
            rows={6}
            className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
          />
          <button
            disabled={isLoading}
            className="w-full bg-gold-gradient text-onyx py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
          >
            {isLoading ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
