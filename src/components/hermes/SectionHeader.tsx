interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export const SectionHeader = ({ label, title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-16 md:mb-20">
      <p className="font-mono text-xs tracking-[0.25em] uppercase text-midground mb-4">{label}</p>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight max-w-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
