import { stats } from "@/data/site";
import StatsRow from "./StatsRow";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32">
      <div className="absolute inset-0 bg-gradient-to-br from-[#07071a] via-[#110526] to-[#0a1020]" />

      <div className="animate-blob-purple absolute -top-24 -right-16 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-500/30 to-transparent blur-3xl" />

      <div className="animate-blob-cyan absolute -bottom-20 -left-12 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-cyan-400/25 to-transparent blur-3xl" />

      <div className="absolute left-[8%] top-[15%] h-20 w-20 rotate-[15deg] rounded-2xl border border-purple-400/10" />

      <div className="absolute right-[18%] top-[25%] h-6 w-6 rotate-45 rounded-md bg-purple-400/10" />

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white md:text-7xl">
          <span
            className="text-transparent"
            style={{
              background: "linear-gradient(to bottom right, #d8b4fe, #67e8f9)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            Digital
          </span>
          <br />
          Products for
          <br />
          Creators
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
          Premium templates, courses &amp; assets crafted for the global creator
          economy.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#products"
            className="rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Explore Products
          </a>
          <a
            href="#services"
            className="rounded-lg border border-white/20 px-8 py-3 text-base font-medium text-gray-300 transition-colors hover:border-white/40 hover:text-white"
          >
            View Showcase &rarr;
          </a>
        </div>

        <div className="mt-16">
          <StatsRow stats={stats} />
        </div>
      </div>
    </section>
  );
}
