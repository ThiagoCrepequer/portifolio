interface StatusBadgeProps {
  label: string;
  value: string;
}

export const StatusBadge = ({ label, value }: StatusBadgeProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-border bg-[rgba(255,255,255,0.02)]">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-xs text-midground">{value}</span>
    </div>
  );
};
