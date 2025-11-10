interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  highlight?: string;
}

export function MetricCard({ label, value, trend, highlight }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {trend && <p className="text-xs text-success mt-1">{trend}</p>}
      {highlight && <p className="text-xs text-white/60 mt-1">{highlight}</p>}
    </div>
  );
}
