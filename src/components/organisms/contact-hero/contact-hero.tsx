import { contactHeroContent } from "@/lib/content/contact";

export function ContactHero() {
  const { title, description } = contactHeroContent;

  return (
    <section className="pt-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-md text-center">
        <h1 className="text-display text-on-surface max-lg:text-headline-lg-mobile">
          {title}
        </h1>
        <p className="text-body-lg text-on-surface-variant">{description}</p>
      </div>
    </section>
  );
}
