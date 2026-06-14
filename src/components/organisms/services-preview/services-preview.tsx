import { ServiceCard } from "@/components/molecules/service-card";
import { homeServicesContent } from "@/lib/content/home";

export function ServicesPreview() {
  const { label, title, description, items } = homeServicesContent;

  return (
    <section id="services" className="scroll-mt-section py-xl">
      <div className="flex w-full flex-col gap-xl">
        <div className="flex w-full flex-col gap-lg md:flex-row md:items-end md:gap-lg lg:gap-xl">
          <div className="flex min-w-0 flex-1 basis-full flex-col gap-md md:basis-0">
            <span className="text-label-md text-on-tertiary-container">
              {label}
            </span>
            <h2 className="w-full text-headline-lg text-on-surface">{title}</h2>
          </div>
          <p className="min-w-0 flex-1 basis-full w-full text-body-md text-on-surface-variant md:basis-0">
            {description}
          </p>
        </div>

        <div className="flex w-full flex-col gap-md md:flex-row md:flex-wrap">
          {items.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              className="min-w-0 md:flex-[1_1_calc(50%-8px)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
