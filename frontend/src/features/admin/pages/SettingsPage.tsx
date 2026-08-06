import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import { toast } from "sonner";
import {
  Heart,
  Image as ImageIcon,
  Package,
  RotateCcw,
  ShoppingCart,
  Star,
  Upload,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_THEME_FORM,
  THEME_BUTTON_FIELDS,
  THEME_FONT_OPTIONS,
  THEME_PRESETS,
  THEME_PRESET_CATEGORIES,
  THEME_COLOR_FIELDS,
  THEME_ICON_FIELDS,
  createThemeForm,
  type ThemeColorKey,
  type ThemeColors,
} from "@/lib/theme";
import {
  createBrandForm,
  THEME_BRAND_FIELDS,
  THEME_BRAND_IMAGE_FIELDS,
  type BrandSettings,
} from "@/lib/brand";
import {
  useGetThemeQuery,
  useResetThemeMutation,
  useUpdateThemeMutation,
} from "@/store/services/themeApi";
import {
  useGetBrandSettingsQuery,
  useUpdateBrandSettingsMutation,
} from "@/store/services/brandApi";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/constants";

export default function SettingsPage() {
  const { data: theme } = useGetThemeQuery();
  const { data: brand } = useGetBrandSettingsQuery();
  const [updateTheme, { isLoading: saving }] = useUpdateThemeMutation();
  const [resetTheme, { isLoading: resetting }] = useResetThemeMutation();
  const [updateBrand, { isLoading: savingBrand }] = useUpdateBrandSettingsMutation();

  const initialForm = useMemo(
    () => ({
      ...createThemeForm(
        Object.fromEntries(
          Object.entries(theme ?? {}).filter(
            ([key, value]) => key in DEFAULT_THEME_FORM && typeof value === "string",
          ),
        ) as ThemeColors,
      ),
    }),
    [theme],
  );

  const initialBrandForm = useMemo(
    () => ({
      ...createBrandForm(brand),
    }),
    [brand],
  );

  const [form, setForm] = useState<Record<ThemeColorKey, string>>(initialForm);
  const [brandForm, setBrandForm] = useState<BrandSettings>(initialBrandForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  useEffect(() => {
    setBrandForm(initialBrandForm);
  }, [initialBrandForm]);

  const setField = (key: ThemeColorKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setBrandField = (key: keyof BrandSettings, value: string) => {
    setBrandForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetColors: ThemeColors) => {
    setForm((prev) => ({ ...prev, ...createThemeForm(presetColors) }));
  };

  const groupedPresets = THEME_PRESET_CATEGORIES.map((category) => ({
    category,
    presets: THEME_PRESETS.filter((preset) => preset.category === category),
  })).filter((group) => group.presets.length > 0);

  const previewStyles = {
    "--font-display": form.displayFont,
    "--font-sans": form.bodyFont,
    "--button-gradient-start": form.buttonGradientStart,
    "--button-gradient-end": form.buttonGradientEnd,
    "--button-foreground": form.buttonForeground,
    "--icon-color": form.iconColor,
  } as CSSProperties;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateTheme(form as ThemeColors).unwrap();
      toast.success("Theme settings saved");
    } catch {
      toast.error("Failed to save theme settings");
    }
  };

  const saveBrand = async (nextForm: BrandSettings = brandForm) => {
    try {
      await updateBrand(createBrandForm(nextForm)).unwrap();
      toast.success("Brand identity saved");
    } catch {
      toast.error("Failed to save brand identity");
    }
  };

  const handleReset = async () => {
    try {
      await resetTheme().unwrap();
      toast.success("Theme reset to defaults");
    } catch {
      toast.error("Failed to reset theme");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Update the global palette, typography, and button styling used across the storefront and
            admin panel.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="inline-flex items-center gap-2 border border-border px-4 py-3 text-xs tracking-[0.25em] uppercase hover:border-gold disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          {resetting ? "Resetting…" : "Reset Theme"}
        </button>
      </div>

      <form onSubmit={save} className="card-luxe p-5 sm:p-8 space-y-8">
        <section>
          <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="font-display text-xl">Presets</h2>
              <p className="text-sm text-muted-foreground">
                Pick a ready-made palette and then customize any color.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            {groupedPresets.map((group) => (
              <div key={group.category} className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-sm tracking-[0.25em] uppercase text-muted-foreground">
                    {group.category}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {group.presets.length} preset{group.presets.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.presets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.colors)}
                      className="group rounded-[20px] border border-border bg-background/40 p-4 text-left transition hover:border-gold hover:shadow-[0_0_0_1px_var(--gold)]"
                    >
                      <div
                        className="h-24 rounded-[20px] border border-border/60 mb-4 overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${
                            preset.colors.background ?? DEFAULT_THEME_FORM.background
                          }, ${preset.colors.primary ?? DEFAULT_THEME_FORM.primary})`,
                        }}
                      />
                      <div className="font-display text-lg">{preset.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{preset.description}</div>
                      <div className="mt-4 flex gap-2">
                        <span
                          className="h-6 w-6 rounded-full border border-border"
                          style={{
                            backgroundColor: preset.colors.primary ?? DEFAULT_THEME_FORM.primary,
                          }}
                        />
                        <span
                          className="h-6 w-6 rounded-full border border-border"
                          style={{
                            backgroundColor:
                              preset.colors.background ?? DEFAULT_THEME_FORM.background,
                          }}
                        />
                        <span
                          className="h-6 w-6 rounded-full border border-border"
                          style={{ backgroundColor: preset.colors.card ?? DEFAULT_THEME_FORM.card }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="font-display text-xl">Typography</h2>
              <p className="text-sm text-muted-foreground">
                Choose elegant font pairings for headings and body text.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Display Font"
              value={form.displayFont}
              options={THEME_FONT_OPTIONS.display}
              onChange={(value) => setField("displayFont", value)}
            />
            <SelectField
              label="Body Font"
              value={form.bodyFont}
              options={THEME_FONT_OPTIONS.body}
              onChange={(value) => setField("bodyFont", value)}
            />
          </div>
          <div
            className="mt-4 rounded-[20px] border border-border bg-background/40 p-5"
            style={previewStyles}
          >
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-2">
              Live Preview
            </p>
            <h3 className="font-display text-2xl sm:text-3xl">{brandForm.appName}</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Luxury jewelry deserves typography that feels editorial, refined, and modern.
            </p>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="font-display text-xl">Brand Identity</h2>
              <p className="text-sm text-muted-foreground">
                Update the app name and public contact details that appear throughout the
                storefront.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEME_BRAND_FIELDS.map((field) => (
              <TextField
                key={field.key}
                label={field.label}
                description={field.description}
                value={brandForm[field.key]}
                onChange={(value) => setBrandField(field.key, value)}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={savingBrand}
              onClick={() => saveBrand()}
              className="bg-gold-gradient text-button-foreground px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
            >
              {savingBrand ? "Saving…" : "Save Brand Identity"}
            </button>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="font-display text-xl">Homepage Images</h2>
              <p className="text-sm text-muted-foreground">
                Upload the hero and category artwork used across the homepage and about page.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {THEME_BRAND_IMAGE_FIELDS.map((field) => (
              <BrandImageField
                key={field.key}
                label={field.label}
                description={field.description}
                value={brandForm[field.key]}
                onUploaded={async (value) => {
                  const nextForm = { ...brandForm, [field.key]: value } as BrandSettings;
                  setBrandForm(nextForm);
                  await saveBrand(nextForm);
                }}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl mb-4">Base Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {THEME_COLOR_FIELDS.filter((field) => field.section === "Base").map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={(value) => setField(field.key, value)}
              />
            ))}
          </div>
        </section>
        <section className="border-t border-border pt-8">
          <h2 className="font-display text-xl mb-4">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {THEME_COLOR_FIELDS.filter((field) => field.section === "Brand").map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={(value) => setField(field.key, value)}
              />
            ))}
          </div>
        </section>
        <section className="border-t border-border pt-8">
          <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="font-display text-xl">Button Colors</h2>
              <p className="text-sm text-muted-foreground">
                Control the accent gradient used by primary buttons and CTAs.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {THEME_BUTTON_FIELDS.map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={(value) => setField(field.key, value)}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3" style={previewStyles}>
            <button
              type="button"
              className="bg-gold-gradient text-button-foreground px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium"
            >
              Primary Button
            </button>
            <button
              type="button"
              className="border border-border px-5 py-3 text-xs tracking-[0.25em] uppercase hover:border-gold"
            >
              Secondary Button
            </button>
          </div>
        </section>
        <section className="border-t border-border pt-8">
          <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="font-display text-xl">Icon Colors</h2>
              <p className="text-sm text-muted-foreground">
                Set the general icon tone used across the UI.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {THEME_ICON_FIELDS.map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={(value) => setField(field.key, value)}
              />
            ))}
          </div>
          <div
            className="mt-4 rounded-2xl border border-border bg-background/40 p-5"
            style={previewStyles}
          >
            <div className="flex items-center gap-4 text-2xl">
              <Star className="h-5 w-5" />
              <Heart className="h-5 w-5" />
              <Package className="h-5 w-5" />
              <ShoppingCart className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              These icons use the preset-driven icon color.
            </p>
          </div>
        </section>
        <section className="border-t border-border pt-8">
          <h2 className="font-display text-xl mb-4">Sidebar Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {THEME_COLOR_FIELDS.filter((field) => field.section === "Sidebar").map((field) => (
              <ColorField
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={(value) => setField(field.key, value)}
              />
            ))}
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-gold-gradient text-button-foreground px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Theme"}
          </button>
        </div>
      </form>
    </div>
  );
}

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <div className="mt-1 flex items-center gap-3 rounded-xl border border-border bg-input px-3 py-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 rounded-md border border-border bg-transparent p-0"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent focus:outline-none"
      />
    </div>
  </label>
);

const BrandImageField = ({
  label,
  description,
  value,
  onUploaded,
}: {
  label: string;
  description: string;
  value: string;
  onUploaded: (value: string) => Promise<void>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ url: string; key: string }>("/uploads/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await onUploaded(data.url);
      toast.success(`${label} uploaded`);
    } catch (err: any) {
      toast.error(err?.message ?? `Failed to upload ${label.toLowerCase()}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-[20px] border border-border bg-background/40 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{description}</div>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[20px] border border-border bg-input flex items-center justify-center">
          {value ? (
            <img src={getImageUrl(value)} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-gold-gradient text-button-foreground px-4 py-2 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : value ? "Replace Image" : "Upload Image"}
          </button>
          <p className="text-xs text-muted-foreground break-all">
            {value ? value : "No image uploaded yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { label: string; value: string }[];
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <div className="mt-1 rounded-xl border border-border bg-input px-3 py-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-auto w-full rounded-none border-0 bg-transparent p-0 shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </label>
);

const TextField = ({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-xl border border-border bg-input px-3 py-3 focus:outline-none focus:border-gold"
    />
    <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
  </label>
);
