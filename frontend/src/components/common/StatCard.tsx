type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  tone?: "primary" | "accent" | "success";
};

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success"
};

export default function StatCard({ label, value, trend, tone = "primary" }: StatCardProps) {
  return (
    <div className="panel-solid p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-content/50">{label}</p>
        <span className={`badge ${toneClasses[tone]}`}>{trend}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-content">{value}</p>
    </div>
  );
}
