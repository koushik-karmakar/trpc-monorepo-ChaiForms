export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "phone"
  | "url"
  | "date"
  | "time"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "rating"
  | "yes_no"
  | "file"
  | "signature"
  | "section_break";

export interface AdminFieldConfig {
  type: FieldType;
  label: string;
  icon: string;
  enabled: boolean;
  maxPerForm: number; // 0 = unlimited
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[]; // for dropdown/radio/checkbox
  maxRating?: number; // for rating
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  shareUrl: string;
  published: boolean;
}

// ── Default admin config ──
export const DEFAULT_FIELD_CONFIGS: AdminFieldConfig[] = [
  { type: "short_text", label: "SHORT TEXT", icon: "T", enabled: true, maxPerForm: 0 },
  { type: "long_text", label: "LONG TEXT", icon: "¶", enabled: true, maxPerForm: 0 },
  { type: "email", label: "EMAIL", icon: "@", enabled: true, maxPerForm: 3 },
  { type: "number", label: "NUMBER", icon: "#", enabled: true, maxPerForm: 0 },
  { type: "phone", label: "PHONE", icon: "☏", enabled: true, maxPerForm: 2 },
  { type: "url", label: "URL / LINK", icon: "⌁", enabled: true, maxPerForm: 0 },
  { type: "date", label: "DATE", icon: "▦", enabled: true, maxPerForm: 0 },
  { type: "time", label: "TIME", icon: "◷", enabled: true, maxPerForm: 0 },
  { type: "dropdown", label: "DROPDOWN", icon: "▾", enabled: true, maxPerForm: 0 },
  { type: "radio", label: "RADIO / CHOICE", icon: "◉", enabled: true, maxPerForm: 0 },
  { type: "checkbox", label: "CHECKBOX", icon: "☑", enabled: true, maxPerForm: 0 },
  { type: "rating", label: "RATING", icon: "★", enabled: true, maxPerForm: 2 },
  { type: "yes_no", label: "YES / NO", icon: "⊕", enabled: true, maxPerForm: 0 },
  { type: "file", label: "FILE UPLOAD", icon: "⊞", enabled: true, maxPerForm: 1 },
  { type: "signature", label: "SIGNATURE", icon: "✍", enabled: false, maxPerForm: 1 },
  { type: "section_break", label: "SECTION BREAK", icon: "—", enabled: true, maxPerForm: 0 },
];

// ── Storage helpers ──

export function getAdminConfig(): AdminFieldConfig[] {
  try {
    const raw = localStorage.getItem("fc_admin_config");
    return raw ? JSON.parse(raw) : DEFAULT_FIELD_CONFIGS;
  } catch {
    return DEFAULT_FIELD_CONFIGS;
  }
}

export function saveAdminConfig(config: AdminFieldConfig[]): void {
  localStorage.setItem("fc_admin_config", JSON.stringify(config));
}

export function getForms(): Form[] {
  try {
    const raw = localStorage.getItem("fc_forms");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveForms(forms: Form[]): void {
  localStorage.setItem("fc_forms", JSON.stringify(forms));
}

export function createForm(title: string, description: string): Form {
  const id = `form_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    title,
    description,
    fields: [],
    createdAt: new Date().toISOString(),
    shareUrl: `https://formcraft.io/f/${id}`,
    published: false,
  };
}

export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
