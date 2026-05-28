"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "~/hooks/api/auth";

type FieldType =
    | "text"
    | "textarea"
    | "email"
    | "number"
    | "dropdown"
    | "checkbox"
    | "radio"
    | "date"
    | "file"
    | "rating"
    | "heading";

type Page = "dashboard" | "builder" | "preview";

interface FieldConfig {
    label: string;
    icon: string;
    allowed: boolean;
    maxCount: number;
}

interface FormField {
    id: number;
    type: FieldType;
    label: string;
    placeholder: string;
    required: boolean;
    options?: string[];
    maxRating?: number;
}

interface Form {
    id: number;
    name: string;
    fields: FormField[];
    createdAt: string;
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; color: #F5F5F0; font-family: 'IBM Plex Mono', monospace; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .fade-up { animation: fadeUp .4s ease both; }
  .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
  .ticker-track { animation: ticker 24s linear infinite; }
  .grotesk { font-family: 'Space Grotesk', sans-serif; }
`;

const DEFAULT_FIELD_CONFIG: Record<FieldType, FieldConfig> = {
    text: { label: "SHORT TEXT", icon: "T", allowed: true, maxCount: 20 },
    textarea: { label: "LONG TEXT", icon: "¶", allowed: true, maxCount: 10 },
    email: { label: "EMAIL", icon: "@", allowed: true, maxCount: 5 },
    number: { label: "NUMBER", icon: "#", allowed: true, maxCount: 10 },
    dropdown: { label: "DROPDOWN", icon: "▾", allowed: true, maxCount: 10 },
    checkbox: { label: "CHECKBOX", icon: "☑", allowed: true, maxCount: 15 },
    radio: { label: "RADIO GROUP", icon: "◉", allowed: true, maxCount: 10 },
    date: { label: "DATE", icon: "◫", allowed: true, maxCount: 5 },
    file: { label: "FILE UPLOAD", icon: "↑", allowed: true, maxCount: 3 },
    rating: { label: "RATING", icon: "★", allowed: true, maxCount: 5 },
    heading: { label: "SECTION HEADING", icon: "H", allowed: true, maxCount: 10 },
};

const TICKER_ITEMS = [
    "SHORT TEXT", "EMAIL", "RATING", "DROPDOWN", "CHECKBOX",
    "DATE", "FILE", "NUMBER", "YES/NO", "SIGNATURE", "LONG TEXT", "RADIO GROUP",
];

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */

function AccentBar() {
    return (
        <div style={{ display: "flex", height: 4 }}>
            {[1, 0, 1, 0, 1].map((on, i) => (
                <div key={i} style={{ flex: 1, background: on ? "#FFD600" : "#0A0A0A" }} />
            ))}
        </div>
    );
}

interface TagProps {
    children: React.ReactNode;
    color?: string;
    bg?: string;
    border?: string;
}

function Tag({ children, color = "#FFD600", bg = "#1A1A1A", border }: TagProps) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 26, padding: "0 10px", background: bg,
            border: `1px solid ${border ?? color}`,
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 10, fontWeight: 700, color, letterSpacing: "2px",
        }}>
            {children}
        </span>
    );
}

type BtnVariant = "primary" | "outline" | "danger" | "ghost";

interface BtnProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: BtnVariant;
    disabled?: boolean;
    style?: React.CSSProperties;
    type?: "button" | "submit" | "reset";
}

function Btn({ children, onClick, variant = "outline", disabled, style = {}, type = "button" }: BtnProps) {
    const base: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 8, height: 44, padding: "0 20px",
        cursor: disabled ? "not-allowed" : "pointer",
        border: "none", fontFamily: "'IBM Plex Mono',monospace",
        fontSize: 11, letterSpacing: "2px", fontWeight: 700,
        transition: "all .15s", opacity: disabled ? 0.4 : 1,
    };

    const variants: Record<BtnVariant, React.CSSProperties> = {
        primary: { background: "#FFD600", color: "#0A0A0A" },
        outline: { background: "transparent", color: "#888", border: "2px solid #3D3D3D" },
        danger: { background: "transparent", color: "#FF6B35", border: "2px solid #FF6B35" },
        ghost: { background: "#111", color: "#888", border: "1px solid #2D2D2D" },
    };

    return (
        <button
            type={type}
            onClick={disabled ? undefined : onClick}
            style={{ ...base, ...variants[variant], ...style }}
        >
            {children}
        </button>
    );
}

/* ============================================================
   USER AVATAR — initials fallback + image support
   ============================================================ */

interface UserAvatarProps {
    name: string;
    avatarImageUrl: string | null;
    size?: number;
}

function UserAvatar({ name, avatarImageUrl, size = 32 }: UserAvatarProps) {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

    if (avatarImageUrl) {
        return (
            <img
                src={avatarImageUrl}
                alt={name}
                width={size}
                height={size}
                style={{
                    width: size, height: size,
                    borderRadius: 0,
                    objectFit: "cover",
                    border: "1px solid #2D2D2D",
                    display: "block",
                }}
            />
        );
    }

    return (
        <div style={{
            width: size, height: size,
            background: "#1A1A1A", border: "1px solid #FFD600",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>
            <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: size * 0.35, fontWeight: 700, color: "#FFD600",
                lineHeight: 1,
            }}>
                {initials || "?"}
            </span>
        </div>
    );
}

/* ============================================================
   USER DROPDOWN — shown when logged in
   ============================================================ */

interface UserDropdownProps {
    userInfo: { id: string; email: string; name: string; avatarImageUrl: string | null };
    /* TODO: wire these callbacks to your auth/router logic */
    onSettings: () => void;
    onLogout: () => void;
}

function UserDropdown({ userInfo, onSettings, onLogout }: UserDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    /* Close on outside click */
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    /* Close on Escape */
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        if (open) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open]);

    const dropdownItem = (label: string, icon: string, onClick: () => void, danger = false) => (
        <button
            onClick={() => { onClick(); setOpen(false); }}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 16px",
                background: "none", border: "none",
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                letterSpacing: "1px", color: danger ? "#FF6B35" : "#888",
                cursor: "pointer", textAlign: "left", transition: "background .1s, color .1s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1A1A1A";
                e.currentTarget.style.color = danger ? "#FF6B35" : "#F5F5F0";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = danger ? "#FF6B35" : "#888";
            }}
        >
            <span style={{ fontSize: 13, width: 16, textAlign: "center", flexShrink: 0 }}>{icon}</span>
            {label}
        </button>
    );

    return (
        <div ref={ref} style={{ position: "relative" }}>
            {/* Trigger button */}
            <button
                onClick={() => setOpen((v) => !v)}
                style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "none", border: `1px solid ${open ? "#FFD600" : "#2D2D2D"}`,
                    padding: "4px 8px 4px 4px",
                    cursor: "pointer", transition: "border-color .15s",
                }}
                onMouseEnter={(e) => { if (!open) e.currentTarget.style.borderColor = "#555"; }}
                onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = "#2D2D2D"; }}
                aria-haspopup="true"
                aria-expanded={open}
                aria-label="User menu"
            >
                <UserAvatar name={userInfo.name} avatarImageUrl={userInfo.avatarImageUrl} size={28} />
                <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                    color: "#888", letterSpacing: "1px", maxWidth: 120,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                    {/* Show first name only to save space */}
                    {userInfo.name.split(" ")[0]?.toUpperCase() ?? userInfo.email}
                </span>
                {/* Chevron */}
                <span style={{
                    color: "#444", fontSize: 8,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform .15s", lineHeight: 1,
                }}>▼</span>
            </button>

            {/* Dropdown panel */}
            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0,
                    minWidth: 220, background: "#0F0F0F",
                    border: "1px solid #2D2D2D", zIndex: 200,
                    animation: "fadeUp .15s ease",
                }}>
                    {/* User info header */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1E1E1E" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <UserAvatar name={userInfo.name} avatarImageUrl={userInfo.avatarImageUrl} size={36} />
                            <div style={{ overflow: "hidden" }}>
                                <p style={{
                                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                                    fontWeight: 700, color: "#F5F5F0",
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                }}>
                                    {userInfo.name}
                                </p>
                                <p style={{
                                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                                    color: "#555", letterSpacing: "0.5px", marginTop: 2,
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                }}>
                                    {userInfo.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderBottom: "1px solid #1E1E1E" }}>
                        <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#444", letterSpacing: "1px" }}>ACTIVE SESSION</span>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "4px 0" }}>
                        {dropdownItem("SETTINGS", "⚙", onSettings)}
                    </div>

                    {/* Danger zone */}
                    <div style={{ borderTop: "1px solid #1E1E1E", padding: "4px 0" }}>
                        {dropdownItem("LOG OUT", "→", onLogout, true)}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ============================================================
   LOGIN BUTTON — shown when not logged in
   ============================================================ */

interface LoginButtonProps {
    onLogin: () => void;
}

function LoginButton({ onLogin }: LoginButtonProps) {
    return (
        <button
            onClick={onLogin}
            style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 36, padding: "0 16px",
                background: "#FFD600", border: "none",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, fontWeight: 700, color: "#0A0A0A",
                letterSpacing: "1.5px", cursor: "pointer",
                transition: "background .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FFD600"; }}
        >
            LOG IN
        </button>
    );
}

/* ============================================================
   NAVBAR
   ============================================================ */

interface NavbarProps {
    page: Page;
    onNav: (page: Page) => void;
    formCount: number;
    userInfo: { id: string; email: string; name: string; avatarImageUrl: string | null } | undefined;
    isUserLoading: boolean;
    /* TODO: wire these to your auth logic */
    onLogin: () => void;
    onLogout: () => void;
    onSettings: () => void;
}

function Navbar({
    page, onNav, formCount,
    userInfo, isUserLoading,
    onLogin, onLogout, onSettings,
}: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems: { id: Page; label: string }[] = [
        { id: "dashboard", label: "MY FORMS" },
        { id: "builder", label: "NEW FORM" },
    ];

    return (
        <header style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: "rgba(10,10,10,0.92)",
            borderBottom: "1px solid #1E1E1E",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
        }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                height: 60, padding: "0 24px",
                maxWidth: 1400, margin: "0 auto",
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ width: 10, height: 10, background: "#FFD600", display: "inline-block" }} />
                    <span className="grotesk" style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F0", letterSpacing: "2.5px" }}>
                        FORMCRAFT
                    </span>
                </div>

                {/* Desktop center nav */}
                <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    {navItems.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => onNav(n.id)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'IBM Plex Mono',monospace",
                                fontSize: 10, letterSpacing: "1.5px",
                                color: page === n.id ? "#FFD600" : "#555",
                                transition: "color .15s", padding: "4px 0", position: "relative",
                            }}
                        >
                            {n.label}
                            {/* Form count badge on MY FORMS */}
                            {n.id === "dashboard" && formCount > 0 && (
                                <span style={{
                                    position: "absolute", top: -6, right: -14,
                                    background: "#FFD600", color: "#0A0A0A",
                                    fontSize: 8, fontWeight: 700, padding: "1px 4px",
                                    fontFamily: "'IBM Plex Mono',monospace",
                                }}>
                                    {formCount}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Right — user section */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    {isUserLoading ? (
                        /* Skeleton loader while user is being fetched */
                        <div style={{
                            width: 80, height: 28,
                            background: "#1A1A1A", border: "1px solid #2D2D2D",
                            animation: "pulse-dot 1.5s ease-in-out infinite",
                        }} />
                    ) : userInfo ? (
                        <UserDropdown
                            userInfo={userInfo}
                            onSettings={onSettings}
                            onLogout={onLogout}
                        />
                    ) : (
                        <LoginButton onLogin={onLogin} />
                    )}

                    {/* Mobile burger */}
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            display: "none", flexDirection: "column", gap: 5, padding: 4,
                        }}
                        className="fc-burger"
                        aria-label="Toggle menu"
                    >
                        {[0, 1, 2].map((i) => (
                            <span key={i} style={{ display: "block", width: 20, height: 1.5, background: "#F5F5F0" }} />
                        ))}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
                <div style={{ background: "rgba(10,10,10,0.97)", borderTop: "1px solid #1E1E1E", padding: "12px 24px" }}>
                    {navItems.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => { onNav(n.id); setMenuOpen(false); }}
                            style={{
                                display: "block", width: "100%", textAlign: "left",
                                background: "none", border: "none",
                                borderBottom: "1px solid #141414", padding: "14px 0",
                                cursor: "pointer",
                                fontFamily: "'IBM Plex Mono',monospace",
                                fontSize: 12, letterSpacing: "2px",
                                color: page === n.id ? "#FFD600" : "#666",
                            }}
                        >
                            {n.label}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
        @media (max-width: 520px) {
          .fc-burger { display: flex !important; }
        }
      `}</style>
        </header>
    );
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */

interface DashboardPageProps {
    forms: Form[];
    onNew: () => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onPreview: (id: number) => void;
}

function DashboardPage({ forms, onNew, onEdit, onDelete, onPreview }: DashboardPageProps) {
    return (
        <div style={{ padding: "88px 24px 64px", maxWidth: 1200, margin: "0 auto" }} className="fade-up">
            {/* Header */}
            <div style={{
                display: "flex", alignItems: "flex-end",
                justifyContent: "space-between", flexWrap: "wrap",
                gap: 16, marginBottom: 40,
            }}>
                <div>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, color: "#FFD600", letterSpacing: "3px" }}>
                        [DASHBOARD] // YOUR FORMS
                    </span>
                    <h1 className="grotesk" style={{
                        fontSize: "clamp(28px,5vw,48px)", fontWeight: 700,
                        color: "#F5F5F0", letterSpacing: "-1px", marginTop: 10, lineHeight: 1.05,
                    }}>
                        YOUR WORKSPACE.
                    </h1>
                </div>
                <Btn variant="primary" onClick={onNew}>+ NEW FORM</Btn>
            </div>

            {/* Empty state */}
            {forms.length === 0 ? (
                <div style={{ border: "1px solid #2D2D2D", background: "#0D0D0D", padding: "64px 32px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 40, color: "#222", marginBottom: 16 }}>◫</div>
                    <p className="grotesk" style={{ fontSize: 22, fontWeight: 700, color: "#333", letterSpacing: "-0.5px", marginBottom: 12 }}>
                        NO FORMS YET.
                    </p>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#444", letterSpacing: "1px", marginBottom: 24 }}>
                        CREATE YOUR FIRST FORM TO GET STARTED.
                    </p>
                    <Btn variant="primary" onClick={onNew}>BUILD YOUR FIRST FORM</Btn>
                </div>
            ) : (
                /* Form cards grid */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
                    {forms.map((form, i) => (
                        <div
                            key={form.id}
                            style={{
                                background: "#0F0F0F", border: "1px solid #2D2D2D",
                                padding: 28, display: "flex", flexDirection: "column",
                                gap: 16, transition: "border-color .2s",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#FFD600"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2D2D2D"; }}
                        >
                            <AccentBar />
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                <Tag>[{String(i + 1).padStart(2, "0")}]</Tag>
                                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#444", letterSpacing: "1px" }}>
                                    {form.createdAt}
                                </span>
                            </div>
                            <h3 className="grotesk" style={{ fontSize: 20, fontWeight: 700, color: "#F5F5F0", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                                {form.name || "UNTITLED FORM"}
                            </h3>
                            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#555", letterSpacing: "1px" }}>
                                {form.fields.length} FIELD{form.fields.length !== 1 ? "S" : ""} // {form.fields.filter((f) => f.required).length} REQUIRED
                            </p>
                            <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
                                <Btn variant="ghost" onClick={() => onEdit(form.id)} style={{ flex: 1, minWidth: 80, height: 36, fontSize: 10 }}>EDIT</Btn>
                                <Btn variant="ghost" onClick={() => onPreview(form.id)} style={{ flex: 1, minWidth: 80, height: 36, fontSize: 10 }}>PREVIEW</Btn>
                                <Btn variant="danger" onClick={() => onDelete(form.id)} style={{ height: 36, padding: "0 12px", fontSize: 10 }}>✕</Btn>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ============================================================
   FIELD TYPE BUTTON (left panel of builder)
   ============================================================ */

interface FieldTypeCardProps {
    type: FieldType;
    config: FieldConfig;
    disabled: boolean;
    onClick: () => void;
}

function FieldTypeCard({ config, disabled, onClick }: FieldTypeCardProps) {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "10px 14px",
                background: "#0D0D0D", border: "1px solid #2D2D2D",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.35 : 1, textAlign: "left",
                transition: "border-color .15s, background .15s",
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.borderColor = "#FFD600";
                    e.currentTarget.style.background = "#111";
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2D2D2D";
                e.currentTarget.style.background = "#0D0D0D";
            }}
        >
            <span style={{
                width: 28, height: 28, background: "#1A1A1A", border: "1px solid #333",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 12,
                color: "#FFD600", flexShrink: 0,
            }}>
                {config.icon}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#CCC", letterSpacing: "1px" }}>
                {config.label}
            </span>
        </button>
    );
}

/* ============================================================
   FIELD CARD (right canvas of builder)
   ============================================================ */

const TYPE_LABELS: Record<FieldType, string> = {
    text: "SHORT TEXT",
    textarea: "LONG TEXT",
    email: "EMAIL",
    number: "NUMBER",
    dropdown: "DROPDOWN",
    checkbox: "CHECKBOX",
    radio: "RADIO GROUP",
    date: "DATE",
    file: "FILE UPLOAD",
    rating: "RATING",
    heading: "SECTION HEADING",
};

const OPTION_TYPES: FieldType[] = ["dropdown", "radio", "checkbox"];

interface FieldCardProps {
    field: FormField;
    index: number;
    total: number;
    onUpdate: (patch: Partial<FormField>) => void;
    onRemove: () => void;
    onMove: (index: number, direction: -1 | 1) => void;
}

function FieldCard({ field, index, total, onUpdate, onRemove, onMove }: FieldCardProps) {
    const [open, setOpen] = useState(false);

    const addOption = () => {
        const opts = [...(field.options ?? []), `OPTION ${(field.options?.length ?? 0) + 1}`];
        onUpdate({ options: opts });
    };

    const updateOption = (i: number, val: string) => {
        const opts = [...(field.options ?? [])];
        opts[i] = val;
        onUpdate({ options: opts });
    };

    const removeOption = (i: number) => {
        const opts = (field.options ?? []).filter((_, idx) => idx !== i);
        onUpdate({ options: opts });
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", background: "#111", border: "1px solid #2D2D2D",
        color: "#F5F5F0", padding: "8px 10px",
        fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, outline: "none",
    };

    return (
        <div
            style={{
                background: "#0F0F0F", border: "1px solid #2D2D2D",
                marginBottom: 2, cursor: "grab", transition: "border-color .15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#444"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2D2D2D"; }}
        >
            {/* Card header row */}
            <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderBottom: open ? "1px solid #1E1E1E" : "none",
            }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#444", cursor: "grab", userSelect: "none", padding: "2px 4px" }}>⠿</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#FFD600", letterSpacing: "1px", fontWeight: 700 }}>
                    [{String(index + 1).padStart(2, "0")}]
                </span>
                <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#CCC",
                    flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                    {field.label || TYPE_LABELS[field.type]}
                </span>
                {field.required && <Tag color="#FF6B35" border="#FF6B35" bg="#1A1A1A">REQ</Tag>}
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button
                        onClick={() => onMove(index, -1)} disabled={index === 0}
                        style={{ width: 22, height: 22, background: "#1A1A1A", border: "1px solid #2D2D2D", color: index === 0 ? "#333" : "#888", cursor: index === 0 ? "not-allowed" : "pointer", fontSize: 10 }}
                    >↑</button>
                    <button
                        onClick={() => onMove(index, 1)} disabled={index === total - 1}
                        style={{ width: 22, height: 22, background: "#1A1A1A", border: "1px solid #2D2D2D", color: index === total - 1 ? "#333" : "#888", cursor: index === total - 1 ? "not-allowed" : "pointer", fontSize: 10 }}
                    >↓</button>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        style={{ width: 22, height: 22, background: open ? "#FFD600" : "#1A1A1A", border: `1px solid ${open ? "#FFD600" : "#2D2D2D"}`, color: open ? "#0A0A0A" : "#888", cursor: "pointer", fontSize: 11 }}
                    >{open ? "−" : "+"}</button>
                    <button
                        onClick={onRemove}
                        style={{ width: 22, height: 22, background: "#1A1A1A", border: "1px solid #FF4444", color: "#FF4444", cursor: "pointer", fontSize: 10 }}
                    >✕</button>
                </div>
            </div>

            {/* Expanded configuration panel */}
            {open && (
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>

                    {/* Label / Heading text */}
                    <div>
                        <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#555", letterSpacing: "1.5px", display: "block", marginBottom: 5 }}>
                            {field.type === "heading" ? "HEADING TEXT" : "FIELD LABEL"}
                        </label>
                        <input
                            value={field.label}
                            onChange={(e) => onUpdate({ label: e.target.value })}
                            placeholder={field.type === "heading" ? "SECTION TITLE" : TYPE_LABELS[field.type]}
                            style={{ ...inputStyle, color: field.type === "heading" ? "#FFD600" : "#F5F5F0", fontWeight: field.type === "heading" ? 700 : 400 }}
                        />
                    </div>

                    {/* Placeholder (text-like fields only) */}
                    {(["text", "textarea", "email", "number"] as FieldType[]).includes(field.type) && (
                        <div>
                            <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#555", letterSpacing: "1.5px", display: "block", marginBottom: 5 }}>
                                PLACEHOLDER TEXT
                            </label>
                            <input
                                value={field.placeholder}
                                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                                placeholder="E.G. ENTER YOUR ANSWER..."
                                style={{ ...inputStyle, color: "#CCC" }}
                            />
                        </div>
                    )}

                    {/* Options (dropdown / radio / checkbox) */}
                    {OPTION_TYPES.includes(field.type) && (
                        <div>
                            <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#555", letterSpacing: "1.5px", display: "block", marginBottom: 6 }}>
                                OPTIONS
                            </label>
                            {(field.options ?? []).map((opt, oi) => (
                                <div key={oi} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                                    <input
                                        value={opt}
                                        onChange={(e) => updateOption(oi, e.target.value)}
                                        style={{ ...inputStyle, flex: 1 }}
                                    />
                                    <button
                                        onClick={() => removeOption(oi)}
                                        style={{ width: 28, background: "#1A1A1A", border: "1px solid #FF4444", color: "#FF4444", cursor: "pointer", fontSize: 10 }}
                                    >✕</button>
                                </div>
                            ))}
                            <button
                                onClick={addOption}
                                style={{
                                    marginTop: 4, background: "#111", border: "1px dashed #333",
                                    color: "#888", padding: "6px 12px", cursor: "pointer",
                                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
                                    letterSpacing: "1px", width: "100%",
                                }}
                            >
                                + ADD OPTION
                            </button>
                        </div>
                    )}

                    {/* Rating max stars */}
                    {field.type === "rating" && (
                        <div>
                            <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#555", letterSpacing: "1.5px", display: "block", marginBottom: 5 }}>
                                MAX STARS
                            </label>
                            <div style={{ display: "flex", gap: 6 }}>
                                {([3, 5, 7, 10] as const).map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => onUpdate({ maxRating: n })}
                                        style={{
                                            width: 36, height: 28,
                                            background: field.maxRating === n ? "#FFD600" : "#1A1A1A",
                                            border: `1px solid ${field.maxRating === n ? "#FFD600" : "#333"}`,
                                            color: field.maxRating === n ? "#0A0A0A" : "#888",
                                            cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace",
                                            fontSize: 11, fontWeight: 700,
                                        }}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Required toggle (not for headings) */}
                    {field.type !== "heading" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
                            <button
                                onClick={() => onUpdate({ required: !field.required })}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    background: "none", border: "none", cursor: "pointer", padding: 0,
                                }}
                            >
                                <div style={{
                                    width: 18, height: 18,
                                    background: field.required ? "#FFD600" : "#111",
                                    border: `1px solid ${field.required ? "#FFD600" : "#444"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {field.required && <span style={{ color: "#0A0A0A", fontSize: 11, fontWeight: 700 }}>✓</span>}
                                </div>
                                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#888", letterSpacing: "1px" }}>
                                    REQUIRED FIELD
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ============================================================
   FORM BUILDER PAGE
   ============================================================ */

let fieldIdCounter = 1;

interface BuilderPageProps {
    fieldConfig: Record<FieldType, FieldConfig>;
    editingForm: Form | null;
    onSave: (data: { name: string; fields: FormField[] }) => void;
    onCancel: () => void;
}

function BuilderPage({ fieldConfig, editingForm, onSave, onCancel }: BuilderPageProps) {
    const [formName, setFormName] = useState<string>(editingForm?.name ?? "");
    const [fields, setFields] = useState<FormField[]>(
        editingForm?.fields ? JSON.parse(JSON.stringify(editingForm.fields)) as FormField[] : []
    );
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
    const [saved, setSaved] = useState(false);

    /* Count current usage of each field type */
    const typeCounts = fields.reduce<Partial<Record<FieldType, number>>>((acc, f) => {
        acc[f.type] = (acc[f.type] ?? 0) + 1;
        return acc;
    }, {});

    const addField = useCallback((type: FieldType) => {
        const cfg = fieldConfig[type];
        if (!cfg?.allowed) return;
        if ((typeCounts[type] ?? 0) >= cfg.maxCount) return;

        const defaults: Partial<FormField> = {};
        if (OPTION_TYPES.includes(type)) defaults.options = ["OPTION 1", "OPTION 2"];
        if (type === "rating") defaults.maxRating = 5;

        setFields((prev) => [
            ...prev,
            {
                id: fieldIdCounter++, type,
                label: "", placeholder: "", required: false,
                ...defaults,
            },
        ]);
    }, [fieldConfig, typeCounts]);

    const updateField = (id: number, patch: Partial<FormField>) => {
        setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    };

    const removeField = (id: number) => {
        setFields((prev) => prev.filter((f) => f.id !== id));
    };

    const moveField = (idx: number, dir: -1 | 1) => {
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= fields.length) return;
        setFields((prev) => {
            const arr = [...prev];
            [arr[idx], arr[newIdx]] = [arr[newIdx]!, arr[idx]!];
            return arr;
        });
    };

    /* Drag-and-drop handlers */
    const handleDragStart = (idx: number) => setDragIdx(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
    const handleDrop = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
        setFields((prev) => {
            const arr = [...prev];
            const [moved] = arr.splice(dragIdx, 1);
            if (moved) arr.splice(idx, 0, moved);
            return arr;
        });
        setDragIdx(null);
        setDragOverIdx(null);
    };
    const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

    const handleSave = () => {
        onSave({ name: formName || "UNTITLED FORM", fields });
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    const enabledTypes = (Object.entries(fieldConfig) as [FieldType, FieldConfig][]).filter(([, v]) => v.allowed);

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Builder topbar */}
            <div style={{
                background: "#111", borderBottom: "1px solid #2D2D2D",
                padding: "0 24px", height: 52,
                display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                position: "sticky", top: 60, zIndex: 50,
            }}>
                <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="FORM NAME..."
                    style={{
                        background: "transparent", border: "none",
                        borderBottom: "1px solid #333", color: "#F5F5F0",
                        padding: "4px 0",
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontSize: 15, fontWeight: 700, letterSpacing: "-0.5px",
                        outline: "none", width: "clamp(140px, 30vw, 300px)",
                    }}
                />
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#444", letterSpacing: "1px" }}>
                    {fields.length} FIELD{fields.length !== 1 ? "S" : ""}
                </span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                    <Btn variant="ghost" onClick={onCancel} style={{ height: 36, fontSize: 10 }}>CANCEL</Btn>
                    <Btn variant="primary" onClick={handleSave} style={{ height: 36, fontSize: 10 }}>
                        {saved ? "✓ SAVED" : "SAVE FORM"}
                    </Btn>
                </div>
            </div>

            {/* Two-column layout */}
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

                {/* LEFT — field type picker */}
                <div style={{
                    width: "clamp(180px, 22vw, 240px)", flexShrink: 0,
                    background: "#0D0D0D", borderRight: "1px solid #1E1E1E",
                    overflowY: "auto", padding: "16px 12px",
                }}>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#FFD600", letterSpacing: "2.5px", fontWeight: 700, marginBottom: 12, paddingLeft: 2 }}>
                        + ADD FIELD
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {enabledTypes.map(([type, cfg]) => {
                            const count = typeCounts[type] ?? 0;
                            const maxed = count >= cfg.maxCount;
                            return (
                                <div key={type} style={{ position: "relative" }}>
                                    <FieldTypeCard type={type} config={cfg} disabled={maxed} onClick={() => addField(type)} />
                                    {count > 0 && (
                                        <span style={{
                                            position: "absolute", top: 4, right: 4,
                                            background: maxed ? "#FF6B35" : "#FFD600", color: "#0A0A0A",
                                            fontSize: 8, fontWeight: 700, padding: "1px 4px",
                                            fontFamily: "'IBM Plex Mono',monospace",
                                        }}>
                                            {count}/{cfg.maxCount}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT — form canvas */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 40px", background: "#080808" }}>
                    {fields.length === 0 ? (
                        <div style={{ border: "1px dashed #2D2D2D", padding: "48px 24px", textAlign: "center", marginTop: 16 }}>
                            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, color: "#1A1A1A", marginBottom: 12 }}>◫</p>
                            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#333", letterSpacing: "2px" }}>
                                CLICK A FIELD TYPE ON THE LEFT TO ADD IT HERE.
                            </p>
                            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#2D2D2D", letterSpacing: "1px", marginTop: 8 }}>
                                DRAG TO REORDER // EXPAND TO CONFIGURE
                            </p>
                        </div>
                    ) : (
                        <div style={{ maxWidth: 600, margin: "0 auto" }}>
                            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#444", letterSpacing: "2px", marginBottom: 12 }}>
                                DRAG FIELDS TO REORDER — CLICK + TO CONFIGURE
                            </p>
                            {fields.map((field, idx) => (
                                <div
                                    key={field.id}
                                    draggable
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        opacity: dragIdx === idx ? 0.4 : 1,
                                        borderLeft: dragOverIdx === idx && dragIdx !== idx ? "3px solid #FFD600" : "3px solid transparent",
                                        transition: "opacity .15s",
                                    }}
                                >
                                    <FieldCard
                                        field={field}
                                        index={idx}
                                        total={fields.length}
                                        onUpdate={(patch) => updateField(field.id, patch)}
                                        onRemove={() => removeField(field.id)}
                                        onMove={(i, d) => moveField(i, d)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   INDIVIDUAL FIELD RENDERER (used in FormPreview)
   ============================================================ */

type FieldValues = Partial<Record<number, string | string[] | number>>;

interface FormFieldRendererProps {
    field: FormField;
    value: string | string[] | number | undefined;
    error: boolean;
    onChange: (val: string | string[] | number) => void;
}

function FormFieldRenderer({ field, value, error, onChange }: FormFieldRendererProps) {
    const baseInputStyle: React.CSSProperties = {
        width: "100%", background: "#111",
        border: `1px solid ${error ? "#FF6B35" : "#2D2D2D"}`,
        color: "#F5F5F0", padding: "10px 12px",
        fontFamily: "'IBM Plex Mono',monospace", fontSize: 12,
        outline: "none", transition: "border-color .15s",
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = "#FFD600";
    };
    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = error ? "#FF6B35" : "#2D2D2D";
    };

    /* Heading — decorative, no input */
    if (field.type === "heading") {
        return (
            <div style={{ borderLeft: "3px solid #FFD600", paddingLeft: 16, marginTop: 8, marginBottom: 4 }}>
                <h3 className="grotesk" style={{ fontSize: 20, fontWeight: 700, color: "#FFD600", letterSpacing: "-0.5px" }}>
                    {field.label || "SECTION"}
                </h3>
            </div>
        );
    }

    const labelEl = (
        <label style={{
            display: "block", fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 10, color: error ? "#FF6B35" : "#888",
            letterSpacing: "1.5px", marginBottom: 8,
        }}>
            {field.label || TYPE_LABELS[field.type]}
            {field.required && <span style={{ color: "#FF6B35", marginLeft: 4 }}>*</span>}
        </label>
    );

    if (field.type === "text") return (
        <div>{labelEl}
            <input type="text" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder || "TYPE YOUR ANSWER..."} style={baseInputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
    );

    if (field.type === "email") return (
        <div>{labelEl}
            <input type="email" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder || "EMAIL@EXAMPLE.COM"} style={baseInputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
    );

    if (field.type === "number") return (
        <div>{labelEl}
            <input type="number" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder || "0"} style={baseInputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
    );

    if (field.type === "date") return (
        <div>{labelEl}
            <input type="date" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}
                style={{ ...baseInputStyle, colorScheme: "dark" }} onFocus={onFocus} onBlur={onBlur} />
        </div>
    );

    if (field.type === "textarea") return (
        <div>{labelEl}
            <textarea value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder || "TYPE YOUR ANSWER..."} rows={4}
                style={{ ...baseInputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={onFocus} onBlur={onBlur} />
        </div>
    );

    if (field.type === "file") return (
        <div>{labelEl}
            <div style={{
                ...baseInputStyle, display: "flex", alignItems: "center", gap: 10,
                cursor: "pointer", justifyContent: "center", padding: "20px 12px",
                border: `1px dashed ${error ? "#FF6B35" : "#2D2D2D"}`,
            }}>
                <span style={{ color: "#555" }}>↑</span>
                <span style={{ color: "#555" }}>CLICK TO UPLOAD FILE</span>
            </div>
        </div>
    );

    if (field.type === "dropdown") return (
        <div>{labelEl}
            <select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}
                style={{ ...baseInputStyle, cursor: "pointer", appearance: "none" }} onFocus={onFocus} onBlur={onBlur}>
                <option value="" style={{ background: "#111" }}>SELECT AN OPTION...</option>
                {(field.options ?? []).map((o, i) => (
                    <option key={i} value={o} style={{ background: "#111" }}>{o}</option>
                ))}
            </select>
        </div>
    );

    if (field.type === "radio") return (
        <div>{labelEl}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(field.options ?? []).map((o, i) => {
                    const checked = value === o;
                    return (
                        <label key={i} style={{
                            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                            padding: "8px 12px",
                            border: `1px solid ${checked ? "#FFD600" : "#2D2D2D"}`,
                            background: checked ? "#111" : "transparent", transition: "all .15s",
                        }}>
                            <div style={{
                                width: 16, height: 16, borderRadius: 8,
                                border: `2px solid ${checked ? "#FFD600" : "#444"}`,
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                                {checked && <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FFD600" }} />}
                            </div>
                            <input type="radio" value={o} checked={checked} onChange={() => onChange(o)} style={{ display: "none" }} />
                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#CCC" }}>{o}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );

    if (field.type === "checkbox") return (
        <div>{labelEl}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(field.options ?? []).map((o, i) => {
                    const checked = Array.isArray(value) && value.includes(o);
                    return (
                        <label key={i} style={{
                            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                            padding: "8px 12px",
                            border: `1px solid ${checked ? "#FFD600" : "#2D2D2D"}`,
                            background: checked ? "#111" : "transparent", transition: "all .15s",
                        }}>
                            <div style={{
                                width: 16, height: 16,
                                border: `2px solid ${checked ? "#FFD600" : "#444"}`,
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                background: checked ? "#FFD600" : "transparent", transition: "all .15s",
                            }}>
                                {checked && <span style={{ color: "#0A0A0A", fontSize: 10, fontWeight: 700 }}>✓</span>}
                            </div>
                            <input
                                type="checkbox" checked={checked}
                                onChange={() => {
                                    const arr = Array.isArray(value) ? [...value] : [];
                                    onChange(checked ? arr.filter((x) => x !== o) : [...arr, o]);
                                }}
                                style={{ display: "none" }}
                            />
                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#CCC" }}>{o}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );

    if (field.type === "rating") {
        const max = field.maxRating ?? 5;
        const numVal = typeof value === "number" ? value : 0;
        return (
            <div>{labelEl}
                <div style={{ display: "flex", gap: 8 }}>
                    {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onChange(star)}
                            style={{
                                width: 40, height: 40,
                                background: numVal >= star ? "#FFD600" : "#111",
                                border: `1px solid ${numVal >= star ? "#FFD600" : "#333"}`,
                                color: numVal >= star ? "#0A0A0A" : "#555",
                                cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace",
                                fontSize: 14, fontWeight: 700, transition: "all .15s",
                            }}
                        >
                            ★
                        </button>
                    ))}
                </div>
                {numVal > 0 && (
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#FFD600", marginTop: 6, letterSpacing: "1px" }}>
                        {numVal}/{max} SELECTED
                    </p>
                )}
            </div>
        );
    }

    return null;
}

/* ============================================================
   FORM PREVIEW PAGE
   ============================================================ */

interface FormPreviewProps {
    form: Form;
    onBack: () => void;
}

function FormPreview({ form, onBack }: FormPreviewProps) {
    const [values, setValues] = useState<FieldValues>({});
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<number, boolean>>>({});
    const [copied, setCopied] = useState(false);

    /* TODO: replace with real published URL from your backend */
    const shareUrl = `https://formcraft.app/f/${form.id}`;

    const setValue = (id: number, val: string | string[] | number) => {
        setValues((prev) => ({ ...prev, [id]: val }));
        setErrors((prev) => { const e = { ...prev }; delete e[id]; return e; });
    };

    const handleSubmit = () => {
        const errs: Partial<Record<number, boolean>> = {};
        form.fields.forEach((f) => {
            if (f.required && f.type !== "heading") {
                const v = values[f.id];
                if (!v || (Array.isArray(v) && v.length === 0) || v === "") {
                    errs[f.id] = true;
                }
            }
        });
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setSubmitted(true);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl).catch(() => { /* noop — clipboard may not be available */ });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    /* Success screen */
    if (submitted) {
        return (
            <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
                <AccentBar />
                <div style={{ maxWidth: 480, width: "100%", padding: 48, background: "#0F0F0F", border: "1px solid #2D2D2D", textAlign: "center", marginTop: 4 }}>
                    <div style={{ width: 56, height: 56, background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24 }}>✓</div>
                    <h2 className="grotesk" style={{ fontSize: 28, fontWeight: 700, color: "#F5F5F0", letterSpacing: "-1px", marginBottom: 12 }}>FORM SUBMITTED!</h2>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#555", letterSpacing: "1px", marginBottom: 32 }}>THANK YOU FOR YOUR RESPONSE.</p>
                    <Btn variant="outline" onClick={onBack}>← BACK TO DASHBOARD</Btn>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#080808", paddingTop: 68 }}>
            {/* Share bar */}
            <div style={{
                background: "#111", borderBottom: "1px solid #2D2D2D",
                padding: "0 24px", height: 52,
                display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
            }}>
                <Btn variant="ghost" onClick={onBack} style={{ height: 36, fontSize: 10 }}>← BACK</Btn>
                <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#444",
                    letterSpacing: "1px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                    {shareUrl}
                </span>
                <Btn variant="primary" onClick={copyLink} style={{ height: 36, fontSize: 10 }}>
                    {copied ? "✓ COPIED!" : "⎘ SHARE LINK"}
                </Btn>
            </div>

            {/* Form content */}
            <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 80px" }} className="fade-up">
                <div style={{ marginBottom: 32 }}>
                    <Tag>[PREVIEW]</Tag>
                    <h1 className="grotesk" style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 700, color: "#F5F5F0", letterSpacing: "-1px", marginTop: 16 }}>
                        {form.name}
                    </h1>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#555", marginTop: 8, letterSpacing: "1px" }}>
                        {form.fields.length} FIELDS // {form.fields.filter((f) => f.required).length} REQUIRED
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {form.fields.map((field) => (
                        <FormFieldRenderer
                            key={field.id}
                            field={field}
                            value={values[field.id]}
                            error={errors[field.id] ?? false}
                            onChange={(val) => setValue(field.id, val)}
                        />
                    ))}
                </div>

                {form.fields.some((f) => f.type !== "heading") && (
                    <div style={{ marginTop: 40 }}>
                        <Btn variant="primary" onClick={handleSubmit} style={{ width: "100%", height: 52, fontSize: 12 }}>
                            SUBMIT FORM →
                        </Btn>
                        {Object.keys(errors).length > 0 && (
                            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#FF6B35", marginTop: 10, letterSpacing: "1px" }}>
                                ⚠ PLEASE FILL IN ALL REQUIRED FIELDS.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ============================================================
   TICKER (bottom bar)
   ============================================================ */

function Ticker() {
    return (
        <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
            height: 32, overflow: "hidden", background: "#0A0A0A", borderTop: "1px solid #1E1E1E",
        }}>
            <div className="ticker-track" style={{ display: "flex", alignItems: "center", height: "100%", whiteSpace: "nowrap" }}>
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
                        <span style={{ width: 4, height: 4, background: "#FFD600", opacity: 0.5, flexShrink: 0, display: "inline-block" }} />
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#333", letterSpacing: "2px" }}>
                            {item}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ============================================================
   ROOT APP
   ============================================================ */

let formIdCounter = 100;

export default function App() {
    const [page, setPage] = useState<Page>("dashboard");
    const [fieldConfig, setFieldConfig] = useState<Record<FieldType, FieldConfig>>(DEFAULT_FIELD_CONFIG);
    const [forms, setForms] = useState<Form[]>([]);
    const [editingFormId, setEditingFormId] = useState<number | null>(null);
    const [previewFormId, setPreviewFormId] = useState<number | null>(null);

    /* ── User data from hook ──
       The hook already handles loading/error states internally.
       We consume only what we need here.                          */
    const { userInfo, isLoading: isUserLoading } = useUser();

    /* ── TODO: wire these handlers to your auth/router logic ── */
    const handleLogin = () => { /* e.g. router.push('/login') or openAuthModal() */ };
    const handleLogout = () => { /* e.g. signOut() then router.push('/') */ };
    const handleSettings = () => { /* e.g. router.push('/settings') */ };

    const editingForm = forms.find((f) => f.id === editingFormId) ?? null;
    const previewForm = forms.find((f) => f.id === previewFormId) ?? null;

    const saveForm = ({ name, fields }: { name: string; fields: FormField[] }) => {
        if (editingFormId !== null) {
            setForms((prev) => prev.map((f) => f.id === editingFormId ? { ...f, name, fields } : f));
        } else {
            const newId = ++formIdCounter;
            setForms((prev) => [
                ...prev,
                {
                    id: newId, name, fields,
                    createdAt: new Date()
                        .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        .toUpperCase(),
                },
            ]);
        }
        setEditingFormId(null);
        setPage("dashboard");
    };

    const deleteForm = (id: number) => {
        setForms((prev) => prev.filter((f) => f.id !== id));
        if (previewFormId === id) setPreviewFormId(null);
    };

    const showNav = page !== "preview";

    return (
        <>
            <style>{GLOBAL_CSS}</style>

            {showNav && (
                <Navbar
                    page={page}
                    onNav={setPage}
                    formCount={forms.length}
                    userInfo={userInfo}
                    isUserLoading={isUserLoading}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onSettings={handleSettings}
                />
            )}

            {(page === "dashboard") && <Ticker />}

            {page === "dashboard" && (
                <DashboardPage
                    forms={forms}
                    onNew={() => { setEditingFormId(null); setPage("builder"); }}
                    onEdit={(id) => { setEditingFormId(id); setPage("builder"); }}
                    onDelete={deleteForm}
                    onPreview={(id) => { setPreviewFormId(id); setPage("preview"); }}
                />
            )}

            {page === "builder" && (
                <BuilderPage
                    fieldConfig={fieldConfig}
                    editingForm={editingForm}
                    onSave={saveForm}
                    onCancel={() => { setEditingFormId(null); setPage("dashboard"); }}
                />
            )}

            {page === "preview" && previewForm && (
                <FormPreview
                    form={previewForm}
                    onBack={() => { setPreviewFormId(null); setPage("dashboard"); }}
                />
            )}
        </>
    );
}