"use client";

import { useEffect, useState } from "react";
import {
    AdminFieldConfig,
    DEFAULT_FIELD_CONFIGS,
    getAdminConfig,
    saveAdminConfig,
} from "./formStore";

// ── Icons ──
function ToggleIcon({ on }: { on: boolean }) {
    return (
        <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
            <rect width="36" height="20" rx="10" fill={on ? "#FFD600" : "#2D2D2D"} />
            <circle cx={on ? 26 : 10} cy="10" r="7" fill={on ? "#0A0A0A" : "#555555"} style={{ transition: "cx 0.2s" }} />
        </svg>
    );
}

function SaveIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ResetIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function AdminPage() {
    const [config, setConfig] = useState<AdminFieldConfig[]>([]);
    const [saved, setSaved] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setConfig(getAdminConfig());
        setMounted(true);
    }, []);

    // Toggle a field's enabled state
    const toggleField = (type: string) => {
        setConfig((prev) =>
            prev.map((f) => (f.type === type ? { ...f, enabled: !f.enabled } : f))
        );
    };

    // Update maxPerForm for a field
    const updateMax = (type: string, val: string) => {
        const num = Math.max(0, parseInt(val) || 0);
        setConfig((prev) =>
            prev.map((f) => (f.type === type ? { ...f, maxPerForm: num } : f))
        );
    };

    const handleSave = () => {
        saveAdminConfig(config);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setConfig(DEFAULT_FIELD_CONFIGS);
        saveAdminConfig(DEFAULT_FIELD_CONFIGS);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const enabledCount = config.filter((f) => f.enabled).length;

    return (
        <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col">
            <style>{`
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
        .fade-up { animation: fade-up .4s ease both; }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

            {/* ── Navbar ── */}
            <header className="flex items-center justify-between h-[60px] px-6 md:px-[48px] border-b border-[#1E1E1E] shrink-0 bg-[#0A0A0A]">
                <div className="flex items-center gap-[10px]">
                    <span className="w-[10px] h-[10px] bg-[#FFD600]" />
                    <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
                        FORMCRAFT
                    </span>
                    <span className="font-ibm-mono text-[10px] text-[#444] tracking-[1px] ml-2">/ ADMIN</span>
                </div>
                <div className="flex items-center gap-[12px]">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-[8px] h-[36px] px-[16px] bg-[#111111] border border-[#2D2D2D] hover:border-[#888888] transition-colors text-[#555555] hover:text-[#F5F5F0]"
                    >
                        <ResetIcon />
                        <span className="font-ibm-mono text-[10px] tracking-[2px]">RESET</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-[8px] h-[36px] px-[16px] transition-colors"
                        style={{ backgroundColor: saved ? "#1A1A1A" : "#FFD600", border: saved ? "1px solid #4ADE80" : "none" }}
                    >
                        <span style={{ color: saved ? "#4ADE80" : "#0A0A0A" }}><SaveIcon /></span>
                        <span
                            className="font-ibm-mono text-[10px] tracking-[2px] font-bold"
                            style={{ color: saved ? "#4ADE80" : "#0A0A0A" }}
                        >
                            {saved ? "SAVED ✓" : "SAVE CONFIG"}
                        </span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 flex-col px-6 md:px-[120px] py-12 md:py-[64px] gap-[48px]">

                {/* ── Page header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-[12px]">
                        <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[3px]">
                            [ADMIN] // FIELD CONFIGURATION
                        </span>
                        <h1 className="font-grotesk text-[40px] md:text-[56px] font-bold text-[#F5F5F0] tracking-[-2px] leading-[1.02]">
                            CONTROL THE<br />
                            <span className="text-[#FFD600]">FIELD STACK.</span>
                        </h1>
                        <p className="font-ibm-mono text-[12px] text-[#555] tracking-[1px] leading-[1.6] max-w-[500px]">
                            ENABLE OR DISABLE FIELD TYPES. SET MAXIMUM USAGE PER FORM. ZERO = UNLIMITED.
                            CHANGES APPLY IMMEDIATELY TO ALL NEW FORMS.
                        </p>
                    </div>

                    {/* Stats bar */}
                    <div className="flex items-center border border-[#1E1E1E] shrink-0">
                        {[
                            { val: String(config.length), lbl: "TOTAL FIELDS" },
                            { val: String(enabledCount), lbl: "ENABLED" },
                            { val: String(config.length - enabledCount), lbl: "DISABLED" },
                        ].map((s, i) => (
                            <div
                                key={s.lbl}
                                className={`flex flex-col items-center justify-center px-[24px] py-[16px] gap-[4px] ${i < 2 ? "border-r border-[#1E1E1E]" : ""}`}
                            >
                                <span className="font-grotesk text-[28px] font-bold text-[#FFD600] tracking-[-1px] leading-none">
                                    {s.val}
                                </span>
                                <span className="font-ibm-mono text-[9px] text-[#444] tracking-[2px]">{s.lbl}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Field config table ── */}
                <div className="flex flex-col w-full border border-[#1E1E1E]">
                    {/* Table header */}
                    <div className="flex items-center h-[44px] bg-[#111111] border-b-2 border-b-[#FFD600] px-0">
                        <div className="flex items-center w-[60px] shrink-0 justify-center border-r border-[#2D2D2D] h-full">
                            <span className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">ICON</span>
                        </div>
                        <div className="flex items-center flex-1 px-[24px] border-r border-[#2D2D2D] h-full">
                            <span className="font-grotesk text-[10px] font-bold text-[#888888] tracking-[2px]">FIELD TYPE</span>
                        </div>
                        <div className="hidden md:flex items-center w-[120px] shrink-0 px-[16px] border-r border-[#2D2D2D] h-full">
                            <span className="font-grotesk text-[10px] font-bold text-[#888888] tracking-[2px]">TYPE ID</span>
                        </div>
                        <div className="flex items-center w-[100px] shrink-0 justify-center border-r border-[#2D2D2D] h-full">
                            <span className="font-grotesk text-[10px] font-bold text-[#888888] tracking-[2px]">ENABLED</span>
                        </div>
                        <div className="flex items-center w-[160px] shrink-0 px-[16px] h-full">
                            <span className="font-grotesk text-[10px] font-bold text-[#888888] tracking-[2px]">MAX / FORM</span>
                        </div>
                    </div>

                    {/* Rows */}
                    {config.map((field, i) => (
                        <div
                            key={field.type}
                            className={`flex items-center h-[56px] transition-colors ${i < config.length - 1 ? "border-b border-[#1A1A1A]" : ""}`}
                            style={{
                                backgroundColor: field.enabled ? (i % 2 === 0 ? "#0D0D0D" : "#0A0A0A") : "#080808",
                                opacity: field.enabled ? 1 : 0.5,
                            }}
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center w-[60px] shrink-0 border-r border-[#1A1A1A] h-full">
                                <div
                                    className="flex items-center justify-center w-[28px] h-[28px] text-[14px]"
                                    style={{ backgroundColor: field.enabled ? "#1A1A1A" : "#111111", color: field.enabled ? "#FFD600" : "#333" }}
                                >
                                    {field.icon}
                                </div>
                            </div>

                            {/* Label */}
                            <div className="flex items-center flex-1 px-[24px] border-r border-[#1A1A1A] h-full">
                                <span
                                    className="font-grotesk text-[13px] font-bold tracking-[1px]"
                                    style={{ color: field.enabled ? "#F5F5F0" : "#444" }}
                                >
                                    {field.label}
                                </span>
                            </div>

                            {/* Type ID */}
                            <div className="hidden md:flex items-center w-[120px] shrink-0 px-[16px] border-r border-[#1A1A1A] h-full">
                                <span className="font-ibm-mono text-[10px] text-[#333] tracking-[1px]">
                                    {field.type}
                                </span>
                            </div>

                            {/* Toggle */}
                            <div className="flex items-center justify-center w-[100px] shrink-0 border-r border-[#1A1A1A] h-full">
                                <button onClick={() => toggleField(field.type)}>
                                    <ToggleIcon on={field.enabled} />
                                </button>
                            </div>

                            {/* Max input */}
                            <div className="flex items-center w-[160px] shrink-0 px-[16px] gap-[8px] h-full">
                                <input
                                    type="number"
                                    min={0}
                                    value={field.maxPerForm}
                                    disabled={!field.enabled}
                                    onChange={(e) => updateMax(field.type, e.target.value)}
                                    className="w-[60px] h-[32px] bg-[#111111] border border-[#2D2D2D] font-ibm-mono text-[12px] text-[#F5F5F0] text-center tracking-[1px] focus:outline-none focus:border-[#FFD600] disabled:opacity-30 disabled:cursor-not-allowed"
                                />
                                <span className="font-ibm-mono text-[9px] text-[#333] tracking-[1px]">
                                    {field.maxPerForm === 0 ? "∞ UNLIMITED" : "MAX"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Info footer ── */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-[16px] p-[24px] bg-[#0D0D0D] border border-[#1E1E1E]">
                    <div className="pulse-dot w-[8px] h-[8px] rounded-full bg-[#FFD600] shrink-0" />
                    <p className="font-ibm-mono text-[11px] text-[#555] tracking-[1px] leading-[1.6]">
                        DISABLED FIELDS WILL NOT APPEAR IN THE FORM BUILDER FOR USERS.
                        MAX PER FORM LIMITS HOW MANY TIMES A SINGLE FIELD TYPE CAN BE ADDED TO ONE FORM.
                        SET TO <span className="text-[#FFD600]">0</span> FOR UNLIMITED USAGE.
                        ALL CHANGES ARE SAVED LOCALLY AND APPLY ON NEXT FORM CREATION.
                    </p>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="flex items-center justify-between h-[44px] px-6 md:px-[48px] border-t border-[#1E1E1E] shrink-0">
                <span className="font-ibm-mono text-[10px] text-[#333] tracking-[1px]">© 2025 FORMCRAFT INC.</span>
                <div className="flex items-center gap-[8px]">
                    <a href="/dashboard" className="font-ibm-mono text-[10px] text-[#FFD600] tracking-[1px] hover:underline">
                        USER DASHBOARD &gt;
                    </a>
                </div>
            </footer>
        </div>
    );
}