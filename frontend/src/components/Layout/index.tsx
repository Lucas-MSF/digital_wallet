import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}
