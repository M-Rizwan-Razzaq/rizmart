"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useSendContactMessageMutation } from "@/store/services/contactApi";
import { DEFAULT_BRAND_FORM, getBrandAddress } from "@/lib/brand";

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
  const atelier = getBrandAddress(brand?.atelier);

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
      toast.success("Your message has been sent successfully.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("We couldn't send your message right now. Please try again.");
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <div className="text-xs font-bold tracking-widest uppercase text-gold mb-2">
            Customer Support
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-primary">
            Get in Touch with {appName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Questions about our school bags, laptop bags, or an existing order? Our team is here to
            assist you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Information Cards */}
          <div className="space-y-4">
            {[
              {
                i: Mail,
                t: "Email Inquiries",
                v: contactEmail,
                desc: "For order inquiries and support",
              },
              {
                i: Phone,
                t: "Phone",
                v: contactPhone,
                desc: "Call RizMart with a product or order question",
              },
              { i: MapPin, t: "Location", v: atelier, desc: "RizMart business address" },
            ].map((c) => (
              <div
                key={c.t}
                className="flex items-start gap-4 bg-card border border-border p-5 sm:p-6 rounded-xl shadow-xs"
              >
                <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 text-primary">
                  <c.i className="h-5 w-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                    {c.t}
                  </div>
                  {c.t === "Email Inquiries" ? (
                    <a
                      href={`mailto:${c.v}`}
                      className="text-sm sm:text-base font-bold text-primary break-words hover:underline"
                    >
                      {c.v}
                    </a>
                  ) : c.t === "Phone" ? (
                    <a
                      href={`tel:${c.v.replace(/[^+\d]/g, "")}`}
                      className="text-sm sm:text-base font-bold text-primary break-words hover:underline"
                    >
                      {c.v}
                    </a>
                  ) : (
                    <div className="text-sm sm:text-base font-bold text-primary break-words">
                      {c.v}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-xs">
            <h2 className="font-display text-xl font-bold text-primary mb-4">Send a Message</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Your Full Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="e.g. Asad Khan"
                  className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Subject
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  placeholder="Order tracking, product question..."
                  className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Message
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full bg-secondary border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground py-3 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isLoading ? "Sending…" : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
