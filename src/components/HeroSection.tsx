import { stats } from "@/data/site";
import StatsRow from "./StatsRow";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-6 pb-16 pt-24">
      {/* Abstract pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white md:text-6xl">
          Premium creative assets
          <br />
          for your next project
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
          Discover fonts, templates, graphics, photos, and 3D assets crafted by independent creators.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#products"
            className="rounded-lg bg-green-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-green-600"
          >
            Browse Products
          </a>
          <a
            href="#"
            className="rounded-lg border border-white/30 px-8 py-3 text-base font-medium text-white transition-colors hover:border-white/50"
          >
            Free Downloads
          </a>
        </div>

        <div className="mt-14">
          <StatsRow stats={stats} variant="dark" />
        </div>
      </div>
    </section>
  );
}
