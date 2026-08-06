import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Mail, Send, Users, ShoppingBag, BadgePercent, type LucideIcon } from "lucide-react";
import {
  useGetPromotionRecipientsQuery,
  useSendPromotionEmailsMutation,
} from "@/store/services/marketingApi";

export default function PromotionPage() {
  const { data: recipientSummary } = useGetPromotionRecipientsQuery();
  const [sendPromotion, { isLoading }] = useSendPromotionEmailsMutation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error("Promotion subject is required");
      return;
    }

    if (!message.trim()) {
      toast.error("Promotion message is required");
      return;
    }

    try {
      const result = await sendPromotion({
        subject: subject.trim(),
        message: message.trim(),
      }).unwrap();
      toast.success(`Promotion sent to ${result.sent} recipient${result.sent === 1 ? "" : "s"}`);
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Failed to send promotion email");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl mb-2">Promotion Emails</h1>
          <p className="text-sm text-muted-foreground">
            Send one campaign to your deduped list of customers, buyers, and newsletter subscribers.
          </p>
        </div>
        <div className="rounded-full border border-border px-4 py-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
          {recipientSummary?.totalUniqueRecipients ?? 0} recipients
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard icon={Users} label="Users" value={recipientSummary?.userEmails ?? 0} />
        <StatCard icon={ShoppingBag} label="Orders" value={recipientSummary?.orderEmails ?? 0} />
        <StatCard icon={Mail} label="Newsletter" value={recipientSummary?.newsletterEmails ?? 0} />
        <StatCard
          icon={BadgePercent}
          label="Duplicates Removed"
          value={recipientSummary?.duplicateEmails ?? 0}
        />
      </div>

      <form onSubmit={submit} className="card-luxe p-5 sm:p-8 space-y-6">
        <TextField
          label="Promotion Subject"
          description="The subject line shown in the inbox."
          value={subject}
          onChange={setSubject}
        />

        <label className="block">
          <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            Promotion Message
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={9}
            className="mt-1 w-full rounded-xl border border-border bg-input px-3 py-3 text-sm focus:outline-none"
            placeholder="Write the promotional message here..."
          />
        </label>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <p className="text-xs text-muted-foreground">
            The campaign will be sent to all unique emails from users, order history, and newsletter
            subscriptions.
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-gold-gradient text-button-foreground px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isLoading ? "Sending…" : "Send Promotion"}
          </button>
        </div>
      </form>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="card-luxe p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <Icon className="h-5 w-5 text-gold shrink-0" />
        <div className="font-display text-2xl">{value}</div>
      </div>
      <div className="mt-4 text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">
        {label}
      </div>
    </div>
  );
}

function TextField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-3 text-sm focus:outline-none"
      />
    </label>
  );
}
