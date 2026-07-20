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
            <div className="text-4xl font-extrabold tracking-tight text-white">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
          </div>
          {i < stats.length - 1 && (
            <div className="h-10 w-px bg-white/[0.08]" />
          )}
        </div>
      ))}
    </div>
  );
}
