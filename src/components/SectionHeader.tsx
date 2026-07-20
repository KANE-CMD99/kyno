interface SectionHeaderProps {
  label: string;
  heading: string;
  subtitle?: string;
}

export default function SectionHeader({
  label,
  heading,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
        {label}
      </span>
      <h2 className="text-3xl font-bold text-white md:text-4xl">{heading}</h2>
      {subtitle && (
        <p className="mt-3 max-w-lg text-base text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
