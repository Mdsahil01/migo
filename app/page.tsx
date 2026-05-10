import { AnchorSections } from "@/components/home/anchor-sections";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <AnchorSections />
        <Features />
      </main>
      <SiteFooter />
    </div>
  );
}
