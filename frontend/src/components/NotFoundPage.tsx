import { Link } from "@/lib/router";
import Seo from "@/components/Seo";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Seo title="Page Not Found" noindex />
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gold-gradient">404</h1>
        <h2 className="mt-4 font-display text-2xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-gold-gradient text-onyx px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
