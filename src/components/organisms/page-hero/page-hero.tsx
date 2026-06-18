type PageHeroProps = {
  label?: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function PageHero({
  label,
  title,
  description,
  align = "left",
}: PageHeroProps) {
  const isCentered = align === "center";

  return (
    <section className="pt-md">
      <div
        className={
          isCentered
            ? "mx-auto flex max-w-3xl flex-col gap-md text-center"
            : "flex max-w-3xl flex-col gap-md"
        }
      >
        {label ? (
          <span className="text-label-md text-on-tertiary-container">{label}</span>
        ) : null}
        <h1 className="text-display text-on-surface max-lg:text-headline-lg-mobile">
          {title}
        </h1>
        <p className="text-body-lg text-on-surface-variant">{description}</p>
      </div>
    </section>
  );
}
