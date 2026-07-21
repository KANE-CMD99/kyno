import type { StatItem } from "@/data/site";

interface StatsRowProps {
  stats: StatItem[];
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="flex items-center justify-center gap-10">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-10">
          <div className="text-center">
            <div className="text-4xl font-extrabold tracking-tight text-neutral-900">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-neutral-400">{stat.label}</div>
          </div>
          {i < stats.length - 1 && (
            <div className="h-10 w-px bg-neutral-200" />
          )}
        </div>
      ))}
    </div>
  );
}
