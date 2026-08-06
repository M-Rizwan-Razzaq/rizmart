import { useEffect, useRef, type ReactNode } from "react";
import {
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List,
  Link as LinkIcon,
  Pilcrow,
  Heading2,
  Eraser,
} from "lucide-react";

type Command =
  | "bold"
  | "italic"
  | "underline"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "formatBlock"
  | "removeFormat"
  | "createLink";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const toolbarButtons: Array<{
  label: string;
  icon: ReactNode;
  command: Command;
  value?: string;
}> = [
  { label: "Bold", icon: <Bold className="h-4 w-4" />, command: "bold" },
  { label: "Italic", icon: <Italic className="h-4 w-4" />, command: "italic" },
  { label: "Underline", icon: <Underline className="h-4 w-4" />, command: "underline" },
  { label: "Bullets", icon: <List className="h-4 w-4" />, command: "insertUnorderedList" },
  { label: "Numbered", icon: <ListOrdered className="h-4 w-4" />, command: "insertOrderedList" },
  { label: "Paragraph", icon: <Pilcrow className="h-4 w-4" />, command: "formatBlock", value: "p" },
  {
    label: "Heading 2",
    icon: <Heading2 className="h-4 w-4" />,
    command: "formatBlock",
    value: "h2",
  },
  { label: "Clear", icon: <Eraser className="h-4 w-4" />, command: "removeFormat" },
  { label: "Link", icon: <LinkIcon className="h-4 w-4" />, command: "createLink" },
];

export function RichTextEditor({ value, onChange, placeholder, className }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const sync = () => {
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const exec = (command: Command, commandValue?: string) => {
    if (typeof document === "undefined") return;

    editorRef.current?.focus();

    if (command === "createLink") {
      const url = window.prompt("Enter the link URL");
      if (!url) return;
      document.execCommand("createLink", false, url);
      sync();
      return;
    }

    if (command === "formatBlock") {
      document.execCommand(command, false, `<${commandValue ?? "p"}>`);
      sync();
      return;
    }

    document.execCommand(command, false, commandValue);
    sync();
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-3">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-3 py-2 text-xs text-muted-foreground transition hover:border-gold hover:text-foreground"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(button.command, button.value)}
            aria-label={button.label}
            title={button.label}
          >
            {button.icon}
            <span className="hidden sm:inline">{button.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-input/40 overflow-hidden">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          data-placeholder={placeholder ?? "Write your content..."}
          className="min-h-[320px] p-4 sm:p-5 outline-none text-sm sm:text-base leading-7 text-foreground
                     [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-foreground
                     [&_p]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6
                     [&_a]:text-gold [&_a]:underline"
        />
      </div>
    </div>
  );
}
