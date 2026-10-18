"use client";

import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useGetContentQuery } from "@/store/services/siteContentApi";

export default function TermsPage() {
  const { data: brand } = useGetBrandSettingsQuery();
  const { data: content } = useGetContentQuery("terms-of-service");
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const page = content ?? DEFAULT_SITE_CONTENT["terms-of-service"];
  const renderedHtml = page.contentHtml.replace(/Desi Muse/g, appName);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 bg-white p-6 sm:p-10 rounded-2xl border border-[#E6E8EC] shadow-xs">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193B63] mb-6 pb-4 border-b border-[#E6E8EC]">
          {page.title}
        </h1>
        <div
          className="space-y-4 text-[#263445] leading-relaxed text-sm sm:text-base
                     [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#193B63] [&_h2]:pt-4 [&_h2]:mb-2
                     [&_p]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6
                     [&_a]:text-[#193B63] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </article>
    </div>
  );
}
