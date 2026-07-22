import { stats } from "@/data/site";
import StatsRow from "./StatsRow";

const placeholders = [
  { label: "Photo Presets", emoji: String.fromCodePoint(0x1F4F7) },
  { label: "Sans Serif", emoji: String.fromCodePoint(0x1F524) },
  { label: "UI Kit", emoji: String.fromCodePoint(0x1F4D0) },
  { label: "Backgrounds", emoji: String.fromCodePoint(0x1F5BC) },
  { label: "Script Font", emoji: String.fromCodePoint(0x270F) },
  { label: "Landing Page", emoji: String.fromCodePoint(0x1F4C4) },
];

const offsets = [
  "md:mt-0",
  "md:-mt-8",
  "md:mt-4",
  "md:mt-0",
  "md:-mt-6",
  "md:mt-2",
];

export default function HeroSection() {
  return (
    <section className="flex min-h-[90vh] items-center bg-[#FAFAFA] px-6 pb-24 pt-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 md:flex-row md:gap-12">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 md:text-7xl">
            Premium
            <br />
            Stock Photos,
            <br />
            Fonts &amp; Templates
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-neutral-500 md:mx-0">
            High-quality stock photos, fonts, and templates — crafted for
            designers and content creators.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href="#products"
              className="w-full rounded-lg bg-blue-600 px-8 py-3 text-center text-base font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              Browse Products
            </a>
            <a
              href="#"
              className="w-full rounded-lg border border-neutral-300 px-8 py-3 text-center text-base font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900 sm:w-auto"
            >
              View Showcase
            </a>
          </div>

          <p className="mt-4 text-sm text-neutral-400">
            Free updates &middot; Lifetime access &middot; 10+ products
          </p>

          <div className="mt-16">
            <StatsRow stats={stats} />
          </div>
        </div>

        {/* Right: Product mosaic */}
        <div className="w-full max-w-md flex-1 md:max-w-none">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {placeholders.map((item, i) => (
              <div
                key={item.label}
                className={`aspect-[4/3] rounded-lg border border-neutral-200 bg-white shadow-sm flex items-center justify-center ${offsets[i]}`}
              >
                <div className="text-center">
                  <span className="text-2xl md:text-3xl">{item.emoji}</span>
                  <p className="mt-1 text-[10px] md:text-xs text-neutral-400 font-medium">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
