import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ApiUser } from "@/store/services/usersApi";

type Props = { open: boolean; onOpenChange: (v: boolean) => void; customer: ApiUser | null };

export function CustomerDetailModal({ open, onOpenChange, customer }: Props) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-3">
            <span className="h-12 w-12 rounded-full bg-gold-gradient text-onyx grid place-items-center font-medium text-lg">
              {customer.name[0].toUpperCase()}
            </span>
            {customer.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4 text-sm">
          <Stat label="Email" value={customer.email} />
          <Stat label="Role" value={customer.role} />
          <Stat label="Phone" value={customer.phone ?? "—"} />
          <Stat label="Joined" value={new Date(customer.createdAt).toLocaleDateString()} />
          <Stat label="Status" value={customer.isBlocked ? "Blocked" : "Active"} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
