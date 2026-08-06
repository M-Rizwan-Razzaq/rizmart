import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Star, Trash2, Pencil } from "lucide-react";
import {
  useGetProductsQuery,
  useDeleteReviewMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  type ApiReview,
} from "@/store/services/productsApi";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import PageSpinner from "@/components/PageSpinner";
import { useGetProductReviewsQuery } from "@/store/services/productsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// We fetch all products then let admins browse reviews per product
export default function ReviewsPage() {
  const { data: productsData, isLoading } = useGetProductsQuery({ limit: 100 });
  const products = productsData?.data ?? [];

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<{ reviewId: string; productId: string } | null>(
    null,
  );
  const [editingReview, setEditingReview] = useState<ApiReview | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [displayName, setDisplayName] = useState("Verified Buyer");
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("Verified Buyer");

  const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReviewsQuery(
    { productId: selectedProductId, page: 1 },
    { skip: !selectedProductId },
  );
  const [deleteReview] = useDeleteReviewMutation();
  const [createReview, { isLoading: savingReview }] = useCreateReviewMutation();
  const [updateReview, { isLoading: updatingReview }] = useUpdateReviewMutation();

  const reviews = reviewsData?.data ?? [];

  const handleCreateReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error("Select a product first");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    try {
      await createReview({
        productId: selectedProductId,
        rating,
        comment: comment.trim(),
        displayName: displayName.trim() || "Verified Buyer",
      }).unwrap();
      toast.success("Review added");
      setRating(5);
      setComment("");
      setDisplayName("Verified Buyer");
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to add review");
    }
  };

  const startEditReview = (review: ApiReview) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditDisplayName(review.displayName ?? review.user?.name ?? "Verified Buyer");
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    if (editComment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    try {
      await updateReview({
        reviewId: editingReview._id,
        productId: editingReview.product,
        rating: editRating,
        comment: editComment.trim(),
        displayName: editDisplayName.trim() || "Verified Buyer",
      }).unwrap();
      toast.success("Review updated");
      setEditingReview(null);
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to update review");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReview(deleteTarget).unwrap();
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
    setDeleteTarget(null);
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl sm:text-3xl mb-1">Reviews</h1>
      <p className="text-sm text-muted-foreground mb-6">Browse and moderate customer reviews.</p>

      {/* Product selector */}
      <div className="mb-6">
        <Select
          value={selectedProductId || "__all__"}
          onValueChange={(v) => setSelectedProductId(v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="w-full rounded-none bg-input px-4 py-2 text-sm focus:border-gold sm:w-80">
            <SelectValue placeholder="Select a product…" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="__all__">Select a product…</SelectItem>
            {products.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name} ({p.reviewCount} review{p.reviewCount !== 1 ? "s" : ""})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="card-luxe p-5 sm:p-6 mb-6">
        <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h2 className="font-display text-xl">Add Review</h2>
            <p className="text-sm text-muted-foreground">
              Create a review for the selected product using the current admin account.
            </p>
          </div>
          <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            {selectedProductId ? "Ready to post" : "Select a product"}
          </div>
        </div>
        <form onSubmit={handleCreateReview} className="grid gap-4">
          <label className="block">
            <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Rating
            </span>
            <Select
              value={String(rating)}
              onValueChange={(v) => setRating(Number(v))}
            >
              <SelectTrigger className="mt-1 w-full rounded-none bg-input px-4 py-2 text-sm focus:border-gold sm:w-40">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {[5, 4, 3, 2, 1].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} star{value > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="block">
            <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Comment
            </span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:border-gold"
              placeholder="Write a helpful review for the selected product..."
            />
          </label>
          <label className="block">
            <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Reviewer name
            </span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:border-gold"
              placeholder="Verified Buyer"
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedProductId || savingReview}
              className="bg-gold-gradient text-onyx px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
            >
              {savingReview ? "Saving…" : "Add Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews list */}
      {!selectedProductId && (
        <div className="text-center text-muted-foreground py-12">
          Select a product to view its reviews.
        </div>
      )}

      {selectedProductId && reviewsLoading && <PageSpinner />}

      {selectedProductId && !reviewsLoading && (
        <div className="space-y-3">
          {reviews.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No reviews for this product.
            </div>
          )}
          {reviews.map((r) => (
            <div key={r._id} className="card-luxe p-4 sm:p-6">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="font-medium">{r.displayName ?? r.user?.name ?? "Guest"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                    {[...Array(5 - r.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted-foreground" />
                    ))}
                  </div>
                  <button
                    onClick={() => startEditReview(r)}
                    className="p-1 hover:text-gold"
                    title="Edit review"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ reviewId: r._id, productId: r.product })}
                    className="p-1 hover:text-destructive"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete this review?"
        description="This cannot be undone. Product rating will be recalculated."
        onConfirm={handleDelete}
      />

      <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Edit Review</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <label className="block">
              <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Rating
              </span>
              <Select
                value={String(editRating)}
                onValueChange={(v) => setEditRating(Number(v))}
              >
                <SelectTrigger className="mt-1 w-full rounded-none bg-input px-4 py-2 text-sm focus:border-gold sm:w-40">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} star{value > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block">
              <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Comment
              </span>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </label>

            <label className="block">
              <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Reviewer name
              </span>
              <input
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </label>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="border border-border px-4 py-2 text-xs tracking-[0.25em] uppercase"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateReview}
              disabled={updatingReview}
              className="bg-gold-gradient text-onyx px-4 py-2 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
            >
              {updatingReview ? "Saving…" : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
