import { servicesOverviewContent } from "@/lib/content/services";

export function ServicesOverview() {
  const { title, items } = servicesOverviewContent;

  return (
    <section className="pb-xl">
      <div className="flex flex-col gap-xl">
        <h2 className="text-headline-md text-on-surface">{title}</h2>

        <div className="flex flex-col gap-xl md:flex-row">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex min-w-0 flex-1 flex-col gap-sm"
            >
              <h3 className="text-body-md font-semibold text-on-surface">
                {item.title}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
