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
    <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
      {eyebrow && (
        <div className="text-xs tracking-[0.2em] uppercase text-gold font-bold mb-2.5">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-primary font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
