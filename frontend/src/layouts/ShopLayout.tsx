import type { ReactNode } from "react";
import { Navbar } from "@/features/shop/components/Navbar";
import { Footer } from "@/features/shop/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
