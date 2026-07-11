import { ServiceOfferingCard } from "@/components/molecules/service-offering-card";
import { homeServicesContent } from "@/lib/content/home";

export function ServicesSection() {
  const { label, title, description, items } = homeServicesContent;

  return (
    <section id="services" className="scroll-mt-section pt-lg pb-xl">
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-md md:max-w-xl">
          <span className="text-label-md text-on-tertiary-container">{label}</span>
          <h2 className="font-display text-headline-lg text-on-surface">{title}</h2>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>

        <div className="flex flex-col gap-md md:flex-row md:flex-wrap">
          {items.map((feature, index) => (
            <ServiceOfferingCard
              key={feature.id}
              feature={feature}
              index={index}
              className="min-w-0 rounded-card md:flex-[1_1_calc(50%-8px)] lg:flex-[1_1_calc(25%-12px)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
