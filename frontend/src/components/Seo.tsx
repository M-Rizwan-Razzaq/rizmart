"use client";

import { useEffect } from "react";
import { buildSeo, type SeoInput } from "@/lib/seo";

export default function Seo({ title, description, path, image, type, noindex, jsonLd }: SeoInput) {
  useEffect(() => {
    const seo = buildSeo({ title, description, path, image, type, noindex, jsonLd });

    document.title = seo.title;

    const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const upsertLink = (rel: string, href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    const upsertJsonLd = (id: string, block: Record<string, unknown>) => {
      let el = document.head.querySelector<HTMLScriptElement>(`script[data-seo-jsonld="${id}"]`);
      if (!el) {
        el = document.createElement("script");
        el.setAttribute("type", "application/ld+json");
        el.setAttribute("data-seo-jsonld", id);
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(block);
    };

    upsertMeta("name", "description", seo.description);
    upsertLink("canonical", seo.url);
    upsertMeta("name", "robots", seo.noindex ? "noindex, nofollow" : "index, follow");

    upsertMeta("property", "og:site_name", seo.title);
    upsertMeta("property", "og:type", seo.type);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", seo.url);
    upsertMeta("property", "og:image", seo.image);
    upsertMeta("property", "og:locale", "en_US");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", seo.image);

    seo.jsonLd.forEach((block, index) => {
      upsertJsonLd(`${path ?? "/"}-${index}`, block);
    });

    return () => {
      document.head
        .querySelectorAll<HTMLScriptElement>("script[data-seo-jsonld]")
        .forEach((el) => el.remove());
    };
  }, [title, description, path, image, type, noindex, JSON.stringify(jsonLd)]);

  return null;
}
