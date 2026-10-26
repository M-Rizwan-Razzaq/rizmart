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
    <div className="bg-secondary min-h-screen py-12 sm:py-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 bg-card p-6 sm:p-10 rounded-2xl border border-border shadow-xs">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mb-6 pb-4 border-b border-border">
          {page.title}
        </h1>
        <div
          className="space-y-4 text-foreground leading-relaxed text-sm sm:text-base
                     [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:pt-4 [&_h2]:mb-2
                     [&_p]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6
                     [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
        <div className="mt-8 pt-4 border-t border-border text-xs font-semibold text-muted-foreground">
          Privacy Questions: <span className="text-primary">{contactEmail}</span>
        </div>
      </article>
    </div>
  );
}
