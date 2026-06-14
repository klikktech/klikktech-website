import { CompactTestimonialCard } from "@/components/molecules/compact-testimonial-card";
import { FeaturedCaseStudyCard } from "@/components/molecules/featured-case-study-card";
import { SatisfactionStatCard } from "@/components/molecules/satisfaction-stat-card";
import { contactSocialProofContent } from "@/lib/content/contact";

export function SocialProofGrid() {
  const { featured, satisfaction, testimonials } = contactSocialProofContent;

  return (
    <section className="py-xl">
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-md lg:flex-row">
          <FeaturedCaseStudyCard
            badge={featured.badge}
            quote={featured.quote}
            name={featured.name}
            role={featured.role}
            className="min-w-0 flex-[1.4]"
          />
          <SatisfactionStatCard
            value={satisfaction.value}
            description={satisfaction.description}
            className="min-w-0 flex-1"
          />
        </div>

        <div className="flex flex-col gap-md md:flex-row">
          {testimonials.map((testimonial) => (
            <CompactTestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              className="min-w-0 flex-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
