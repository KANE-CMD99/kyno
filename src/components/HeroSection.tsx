import { stats } from "@/data/site";
import StatsRow from "./StatsRow";

const placeholders = [
  { label: "UI Kit", emoji: String.fromCodePoint(0x1F4D0) },
  { label: "Icons", emoji: String.fromCodePoint(0x2728) },
  { label: "Photos", emoji: String.fromCodePoint(0x1F4F7) },
  { label: "Fonts", emoji: String.fromCodePoint(0x1F524) },
  { label: "3D", emoji: String.fromCodePoint(0x1F3A8) },
  { label: "Presets", emoji: String.fromCodePoint(0x1F39A) },
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
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 md:text-7xl">
            Premium assets
            <br />
            for creators
            <br />
            who ship
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-neutral-500 md:mx-0">
            High-quality stock photos, templates, icons, and fonts — crafted for
            designers and content creators.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
            <a
              href="#products"
              className="rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
            >
              Browse Products
            </a>
            <a
              href="#"
              className="rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
            >
              Free Downloads
            </a>
          </div>

          <p className="mt-4 text-sm text-neutral-400">
            Free updates &middot; Lifetime access &middot; 50+ products
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
