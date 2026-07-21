export default function ProductMosaic() {
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

  return (
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
  );
}
