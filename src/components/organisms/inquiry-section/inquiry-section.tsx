"use client";

import { ArrowRight, AtSign, MapPin } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { ContactInfoBlock } from "@/components/molecules/contact-info-block";
import { FormField } from "@/components/molecules/form-field";
import { Icon } from "@/components/atoms/icon";
import { contactInquiryContent } from "@/lib/content/contact";
import { siteConfig } from "@/lib/constants/navigation";

export function InquirySection() {
  const { title, description, serviceOptions, submitLabel } =
    contactInquiryContent;

  return (
    <section className="pb-xl">
      <div className="flex flex-col gap-xl lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-lg">
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-lg text-on-surface">{title}</h2>
            <p className="max-w-lg text-body-md text-on-surface-variant">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <ContactInfoBlock
              icon={AtSign}
              label="Email"
              value={siteConfig.contactEmail}
              href={`mailto:${siteConfig.contactEmail}`}
            />
            <ContactInfoBlock
              icon={MapPin}
              label="Address"
              value={siteConfig.contactAddress}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover">
          <form
            className="flex flex-col gap-lg"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <FormField id="full-name" label="Full Name">
              <Input id="full-name" name="fullName" placeholder="Jane Doe" />
            </FormField>

            <FormField id="corporate-email" label="Corporate Email">
              <Input
                id="corporate-email"
                name="email"
                type="email"
                placeholder="jane@company.com"
              />
            </FormField>

            <FormField id="service-interest" label="Service Interest">
              <Select
                id="service-interest"
                name="serviceInterest"
                placeholder="Select a service"
                options={serviceOptions}
              />
            </FormField>

            <FormField id="project-brief" label="Project Brief">
              <Textarea
                id="project-brief"
                name="projectBrief"
                placeholder="Describe your goals, timeline, and constraints..."
              />
            </FormField>

            <Button type="submit" className="w-full">
              {submitLabel}
              <Icon icon={ArrowRight} size="sm" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
