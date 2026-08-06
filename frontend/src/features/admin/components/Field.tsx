import { Children, isValidElement, type ChangeEvent } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold";

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${inputCls} ${props.className ?? ""}`} />
);

type OptionLike = {
  props: { value?: string | number; children?: ReactNode };
};

export const Select = ({
  children,
  className,
  value,
  onChange,
  disabled,
  placeholder,
}: SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) => {
  const options = Children.toArray(children).filter(
    (child) => isValidElement(child) && (child.type as unknown) === "option",
  ) as unknown as OptionLike[];

  const emptyOption = options.find(
    (o) => o.props.value === "" || o.props.value == null,
  );
  const selectable = options.filter(
    (o) => o.props.value !== "" && o.props.value != null,
  );
  const placeholderText =
    placeholder ?? (emptyOption ? String(emptyOption.props.children) : undefined);
  const currentValue = value != null && value !== "" ? String(value) : undefined;

  return (
    <BaseSelect
      value={currentValue}
      onValueChange={(v) =>
        onChange?.({ target: { value: v } } as unknown as ChangeEvent<HTMLSelectElement>)
      }
      disabled={disabled}
    >
      <SelectTrigger
        className={`${inputCls} ${className ?? ""} h-auto rounded-none`}
      >
        <SelectValue placeholder={placeholderText} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {selectable.map((o) => (
          <SelectItem key={String(o.props.value)} value={String(o.props.value)}>
            {o.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </BaseSelect>
  );
};

export const TextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`${inputCls} ${props.className ?? ""}`} />
);
