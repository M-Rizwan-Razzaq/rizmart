export { adminMetadata as metadata } from "@/lib/seo-metadata";
import AdminShell from "./AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}