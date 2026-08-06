"use client";

const heroImg1 = "/BG.png";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useGetContentQuery } from "@/store/services/siteContentApi";
import { getImageUrl } from "@/lib/constants";

export default function AboutPage() {
  const { data: brand } = useGetBrandSettingsQuery();
  const { data: content } = useGetContentQuery("about");
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const atelier = brand?.atelier?.trim() || DEFAULT_BRAND_FORM.atelier;
  const aboutImage =
    getImageUrl(brand?.aboutUsImage?.trim() || DEFAULT_BRAND_FORM.aboutUsImage) || heroImg1;
  const page = content ?? DEFAULT_SITE_CONTENT.about;
  const renderedHtml = page.contentHtml.replace(/Desi Muse/g, appName);

  return (
    <div>
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[360px] sm:min-h-[400px] overflow-hidden">
        <img
          src={aboutImage}
          alt="Atelier"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">Our Story</div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl max-w-3xl">{page.title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 space-y-8 text-muted-foreground leading-relaxed">
        <div
          className="space-y-4 text-muted-foreground leading-7
                     [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3
                     [&_p]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6
                     [&_a]:text-gold [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
        <p className="text-sm uppercase tracking-[0.25em] text-gold">{atelier}</p>
      </section>
      <section className="border-t border-border/60 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
          {[
            { n: "20+", l: "Years of Craft" },
            { n: "100%", l: "Recycled Gold" },
            { n: "Lifetime", l: "Warranty" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl sm:text-5xl text-gold-gradient mb-2">{s.n}</div>
              <div className="text-xs tracking-[0.25em] uppercase text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
