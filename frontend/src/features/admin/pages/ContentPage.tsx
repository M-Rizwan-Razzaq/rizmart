import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FileText, PencilLine, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextInput, Field } from "@/features/admin/components/Field";
import { RichTextEditor } from "@/features/admin/components/RichTextEditor";
import {
  DEFAULT_SITE_CONTENT,
  SITE_CONTENT_TABS,
  createSiteContentForm,
  type SiteContentDraft,
  type SiteContentSlug,
} from "@/lib/siteContent";
import { useGetContentsQuery, useUpdateContentMutation } from "@/store/services/siteContentApi";

export default function ContentPage() {
  const { data: contents, isLoading, isFetching } = useGetContentsQuery();
  const [updateContent, { isLoading: saving }] = useUpdateContentMutation();
  const [activeTab, setActiveTab] = useState<SiteContentSlug>("about");

  const initialForms = useMemo(() => {
    const bySlug = new Map((contents ?? []).map((item) => [item.slug as SiteContentSlug, item]));

    return SITE_CONTENT_TABS.reduce<Record<SiteContentSlug, SiteContentDraft>>(
      (acc, tab) => {
        acc[tab.slug] = createSiteContentForm(tab.slug, bySlug.get(tab.slug));
        return acc;
      },
      {} as Record<SiteContentSlug, SiteContentDraft>,
    );
  }, [contents]);

  const [forms, setForms] = useState<Record<SiteContentSlug, SiteContentDraft>>(
    () =>
      Object.fromEntries(
        SITE_CONTENT_TABS.map((tab) => [tab.slug, DEFAULT_SITE_CONTENT[tab.slug]]),
      ) as Record<SiteContentSlug, SiteContentDraft>,
  );

  useEffect(() => {
    if (contents?.length) {
      setForms(initialForms);
    }
  }, [initialForms]);

  const setForm = (slug: SiteContentSlug, patch: Partial<SiteContentDraft>) => {
    setForms((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        ...patch,
      },
    }));
  };

  const saveContent = async (slug: SiteContentSlug) => {
    try {
      await updateContent(forms[slug]).unwrap();
      toast.success(`${forms[slug].title} saved`);
    } catch {
      toast.error(`Failed to save ${forms[slug].title}`);
    }
  };

  const resetToDefaults = async (slug: SiteContentSlug) => {
    const defaults = DEFAULT_SITE_CONTENT[slug];

    setForm(slug, defaults);

    try {
      await updateContent(defaults).unwrap();
      toast.success(`${defaults.title} reset to defaults`);
    } catch {
      toast.error(`Failed to reset ${defaults.title}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl mb-2">Content</h1>
          <p className="text-sm text-muted-foreground">
            Edit the About, Privacy Policy, Terms, and Refund pages from one place. The content is
            saved in a dedicated database collection and rendered dynamically on the storefront.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="card-luxe p-8 text-sm text-muted-foreground">Loading content...</div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as SiteContentSlug)}
          className="space-y-6"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl border border-border bg-gradient-to-r from-background/70 via-background/40 to-background/70 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:grid-cols-4">
            {SITE_CONTENT_TABS.map((tab) => (
              <TabsTrigger
                key={tab.slug}
                value={tab.slug}
                className="rounded-xl px-4 py-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground transition-all duration-200 hover:text-foreground data-[state=active]:bg-gold-gradient data-[state=active]:text-button-foreground data-[state=active]:shadow-[0_10px_24px_rgba(216,180,107,0.28)] data-[state=active]:scale-[1.01]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {SITE_CONTENT_TABS.map((tab) => {
            const draft = forms[tab.slug];

            return (
              <TabsContent key={tab.slug} value={tab.slug} className="m-0">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                  <form
                    onSubmit={(e: FormEvent) => {
                      e.preventDefault();
                      saveContent(tab.slug);
                    }}
                    className="card-luxe p-5 sm:p-6 space-y-6"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h2 className="font-display text-xl">{tab.label}</h2>
                        <p className="text-sm text-muted-foreground">
                          Use the toolbar to format headings, paragraphs, lists, and links.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void resetToDefaults(tab.slug)}
                        className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:border-gold hover:text-foreground"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Reset
                      </button>
                    </div>

                    <Field label="Page Title">
                      <TextInput
                        value={draft.title}
                        onChange={(e) => setForm(tab.slug, { title: e.target.value })}
                        placeholder="Page title"
                      />
                    </Field>

                    <Field label="Content Editor">
                      <RichTextEditor
                        value={draft.contentHtml}
                        onChange={(value) => setForm(tab.slug, { contentHtml: value })}
                        placeholder={`Write the ${tab.label.toLowerCase()} content...`}
                      />
                    </Field>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-gold-gradient text-button-foreground px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
                      >
                        <PencilLine className="h-4 w-4" />
                        {saving ? "Saving…" : "Save Content"}
                      </button>
                    </div>
                  </form>

                  <div className="card-luxe p-5 sm:p-6">
                    <div className="mb-4">
                      <h3 className="font-display text-lg mb-1">Preview</h3>
                      <p className="text-sm text-muted-foreground">
                        This is how the content will appear on the public page.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/40 p-5">
                      <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-3">
                        {tab.label}
                      </div>
                      <h4 className="font-display text-3xl mb-4">{draft.title}</h4>
                      <div
                        className="space-y-4 text-muted-foreground leading-7
                                   [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3
                                   [&_p]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6
                                   [&_a]:text-gold [&_a]:underline"
                        dangerouslySetInnerHTML={{
                          __html: draft.contentHtml || DEFAULT_SITE_CONTENT[tab.slug].contentHtml,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
