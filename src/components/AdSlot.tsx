export default function AdSlot() {
  // Hidden by default — remove the `hidden` class when Google Ads is configured
  return (
    <section className="bg-[#FAFAFA] px-6 py-12 hidden">
      <div className="mx-auto max-w-6xl">
        <div
          id="ad-slot"
          className="flex h-24 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-100"
        >
          <span className="text-sm text-neutral-400">Advertisement</span>
        </div>
      </div>
    </section>
  );
}
