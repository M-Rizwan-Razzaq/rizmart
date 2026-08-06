import { useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle, Trash2, Eye, Search } from "lucide-react";
import {
  useGetUsersQuery,
  useBlockUserMutation,
  useDeleteUserMutation,
  type ApiUser,
} from "@/store/services/usersApi";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { formatPrice } from "@/lib/constants";
import PageSpinner from "@/components/PageSpinner";

export default function CustomersPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<ApiUser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetUsersQuery({ page, limit: 10, search: q || undefined });
  const [blockUser] = useBlockUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const customers = (data?.data ?? []).filter((u) => u.role === "customer");
  const totalPages = data?.totalPages ?? 1;

  const handleToggleBlock = async (user: ApiUser) => {
    try {
      await blockUser({ id: user._id, isBlocked: !user.isBlocked }).unwrap();
      toast.success(`${user.name} ${user.isBlocked ? "unblocked" : "blocked"}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId).unwrap();
      toast.success("Customer deleted");
    } catch {
      toast.error("Failed to delete customer");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl sm:text-3xl mb-1">Customers</h1>
      <p className="text-sm text-muted-foreground mb-6 sm:mb-8">
        {data?.total ?? 0} registered customers
      </p>

      <div className="card-luxe">
        <div className="p-3 sm:p-4 border-b border-border relative">
          <Search className="absolute left-6 sm:left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or email…"
            className="bg-input border border-border pl-10 pr-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:border-gold"
          />
        </div>

        {isLoading ? (
          <PageSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="text-left text-xs tracking-widest uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-b border-border/50 hover:bg-accent/30">
                    <td className="p-4">
                      <button
                        onClick={() => setDetail(c)}
                        className="flex items-center gap-3 text-left hover:text-gold"
                      >
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gold-gradient text-onyx grid place-items-center font-medium">
                          {c.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{c.email}</div>
                        </div>
                      </button>
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] tracking-widest uppercase border px-2 py-1 whitespace-nowrap ${!c.isBlocked ? "text-green-400 border-green-400/40" : "text-red-400 border-red-400/40"}`}
                      >
                        {c.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => setDetail(c)}
                          className="p-2 hover:text-gold"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {!c.isBlocked ? (
                          <button
                            onClick={() => handleToggleBlock(c)}
                            className="p-2 hover:text-yellow-400"
                            title="Block"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleBlock(c)}
                            className="p-2 hover:text-green-400"
                            title="Unblock"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(c._id)}
                          className="p-2 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border text-xs tracking-widest uppercase text-muted-foreground">
            <div>
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border border-border px-3 py-1 disabled:opacity-40 hover:border-gold"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border border-border px-3 py-1 disabled:opacity-40 hover:border-gold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer detail panel */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80" onClick={() => setDetail(null)} />
          <div className="relative card-luxe max-w-sm w-full p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-gold-gradient text-onyx grid place-items-center text-xl font-display">
                {detail.name[0].toUpperCase()}
              </div>
              <div>
                <div className="font-display text-xl">{detail.name}</div>
                <div className="text-sm text-muted-foreground">{detail.email}</div>
                {detail.phone && (
                  <div className="text-xs text-muted-foreground">{detail.phone}</div>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="text-foreground">Role:</span> {detail.role}
              </div>
              <div>
                <span className="text-foreground">Joined:</span>{" "}
                {new Date(detail.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="text-foreground">Status:</span>{" "}
                <span className={detail.isBlocked ? "text-red-400" : "text-green-400"}>
                  {detail.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setDetail(null)}
              className="mt-6 w-full border border-border hover:border-gold py-2 text-xs tracking-widest uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete this customer?"
        description="Their account will be permanently removed."
        onConfirm={handleDelete}
      />
    </div>
  );
}
