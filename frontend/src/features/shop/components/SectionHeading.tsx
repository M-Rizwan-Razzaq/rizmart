export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {eyebrow && (
        <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">{eyebrow}</div>
      )}
      <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
    </div>
  );
}
