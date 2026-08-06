"use client";

import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useGetContentQuery } from "@/store/services/siteContentApi";

export default function PrivacyPage() {
  const { data: brand } = useGetBrandSettingsQuery();
  const { data: content } = useGetContentQuery("privacy-policy");
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const contactEmail = brand?.contactEmail?.trim() || DEFAULT_BRAND_FORM.contactEmail;
  const page = content ?? DEFAULT_SITE_CONTENT["privacy-policy"];
  const renderedHtml = page.contentHtml
    .replace(/Desi Muse/g, appName)
    .replace(/our support team/gi, contactEmail);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-4xl sm:text-5xl mb-8">{page.title}</h1>
      <div
        className="space-y-4 text-muted-foreground leading-7
                   [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:pt-6
                   [&_p]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6
                   [&_a]:text-gold [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
      <p className="mt-8 text-sm text-muted-foreground">Contact: {contactEmail}</p>
    </article>
  );
}
