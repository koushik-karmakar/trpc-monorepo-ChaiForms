"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAuthenticationMethods, useGoogleAuthentication } from "~/hooks/api/auth";
/* ── Inline SVG icons ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#555555" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="#555555" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4Z"
        stroke="#4ADE80"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="#4ADE80"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 13l4 4L19 7"
        stroke="#FFD600"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PERKS = [
  "UNLIMITED FORMS ON FREE PLAN",
  "NO CREDIT CARD REQUIRED",
  "REAL-TIME RESPONSE ANALYTICS",
  "CONDITIONAL LOGIC & WEBHOOKS",
];

const TICKER_ITEMS = [
  "REAL-TIME COLLAB",
  "AI FIELD SUGGESTIONS",
  "CONDITIONAL LOGIC",
  "CSV EXPORT",
  "DARK MODE THEMES",
  "WEBHOOK SUPPORT",
  "RESPONSE INBOX",
  "COMPLETION ANALYTICS",
];

export default function Login() {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { authenticationWithGoogleMutateAsync, isPending, isError } =
    useGoogleAuthentication();

  const { methods, error, isLoading } = useGetAuthenticationMethods();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const handleCallback = async () => {
      try {
        await authenticationWithGoogleMutateAsync({ code });
        router.push("/dashboard");
      } catch (err) {
        console.error("Google authentication failed:", err);
      }
    };

    handleCallback();
  }, [searchParams]);

  const handleGoogleLogin = () => {
    const googleMethod = methods?.find(
      (method) => method.provider === "GOOGLE_OAUTH"
    );

    if (!googleMethod?.authUrl) {
      console.error("Google authentication unavailable");
      return;
    }

    window.location.href = googleMethod.authUrl;
  };
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col overflow-hidden">
      {/* Keyframes */}
      <style>{`
        @keyframes scan { 0%{transform:translateY(-100vh)} 100%{transform:translateY(100vh)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .scan-line { animation: scan 6s linear infinite; }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .ticker-track { animation: ticker 20s linear infinite; }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        .fade-up-1 { animation: fade-up .5s ease both .1s; }
        .fade-up-2 { animation: fade-up .5s ease both .25s; }
        .fade-up-3 { animation: fade-up .5s ease both .4s; }
        .fade-up-4 { animation: fade-up .5s ease both .55s; }
        .fade-up-5 { animation: fade-up .5s ease both .7s; }
      `}</style>

      {/* ── Top navbar ── */}
      <header className="flex items-center justify-between h-[60px] px-6 md:px-[48px] border-b border-[#1E1E1E] shrink-0">
        <Link href="/" className="flex items-center gap-[10px] group">
          <span className="w-[10px] h-[10px] bg-[#FFD600] group-hover:scale-110 transition-transform" />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            FORMCRAFT
          </span>
        </Link>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col w-[480px] xl:w-[520px] shrink-0 bg-[#0D0D0D] border-r border-[#1E1E1E] relative overflow-hidden">
          {/* Scanline effect */}
          <div
            className="scan-line absolute left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: "rgba(255,214,0,0.04)", top: 0, zIndex: 10 }}
          />

          {/* Grid dots */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            {Array.from({ length: 16 }, (_, c) =>
              Array.from({ length: 24 }, (_, r) => (
                <div
                  key={`${c}-${r}`}
                  className="absolute w-[2px] h-[2px] rounded-full bg-[#1A1A1A]"
                  style={{ left: c * 32 + 16, top: r * 32 + 16 }}
                />
              )),
            )}
          </div>

          <div className="relative z-10 flex flex-col flex-1 p-[48px] gap-0">
            {/* Section label */}
            <span
              className={`font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[3px] ${mounted ? "fade-up-1" : "opacity-0"}`}
            >
              [WELCOME BACK]
            </span>

            <div className="h-[32px]" />

            {/* Big headline */}
            <h1
              className={`font-grotesk text-[52px] xl:text-[60px] font-bold text-[#F5F5F0] tracking-[-2px] leading-[1.02] whitespace-pre-line ${mounted ? "fade-up-2" : "opacity-0"}`}
            >
              {"BUILD\nFORMS\nTHAT"}
            </h1>
            <h1
              className={`font-grotesk text-[52px] xl:text-[60px] font-bold text-[#FFD600] tracking-[-2px] leading-[1.02] ${mounted ? "fade-up-3" : "opacity-0"}`}
            >
              CONVERT.
            </h1>

            <div className="h-[40px]" />

            {/* Perks */}
            <div
              className={` mb-6 flex flex-col gap-[14px] ${mounted ? "fade-up-4" : "opacity-0"}`}
            >
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-[12px]">
                  <div className="flex items-center justify-center w-[20px] h-[20px] bg-[#1A1A1A] border border-[#FFD600] shrink-0">
                    <CheckIcon />
                  </div>
                  <span className="font-ibm-mono text-[11px] text-[#888888] tracking-[1px]">
                    {perk}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1" />

            {/* Stats row */}
            <div
              className={`flex items-center gap-0 border border-[#1E1E1E] ${mounted ? "fade-up-5" : "opacity-0"}`}
            >
              {[
                { val: "50K+", lbl: "FORMS" },
                { val: "2M+", lbl: "RESPONSES" },
                { val: "73%", lbl: "COMPLETION" },
              ].map((s, i) => (
                <div
                  key={s.lbl}
                  className={`flex flex-col items-center justify-center flex-1 py-[20px] gap-[4px] ${i < 2 ? "border-r border-[#1E1E1E]" : ""}`}
                >
                  <span className="font-grotesk text-[24px] font-bold text-[#FFD600] tracking-[-1px] leading-none">
                    {s.val}
                  </span>
                  <span className="font-ibm-mono text-[9px] text-[#444] tracking-[2px]">
                    {s.lbl}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom ticker */}
          <div className="relative z-10 border-t border-[#1E1E1E] h-[40px] overflow-hidden bg-[#0A0A0A]">
            <div className="ticker-track flex items-center h-full whitespace-nowrap">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-[10px] px-[20px]">
                  <span className="w-[4px] h-[4px] bg-[#FFD600] opacity-50 shrink-0" />
                  <span className="font-ibm-mono text-[9px] text-[#333] tracking-[2px]">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL / Login card ── */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 relative">
          {/* Subtle background noise grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 60% 20%, rgba(255,214,0,0.03) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(255,107,53,0.02) 0%, transparent 50%)",
            }}
          />

          <div
            className={`relative z-10 flex flex-col w-full max-w-[420px] ${mounted ? "fade-up-2" : "opacity-0"}`}
          >
            {/* Card */}
            <div className="flex flex-col gap-0 bg-[#0F0F0F] border border-[#2D2D2D]">
              {/* Card header accent bar */}
              <div className="flex h-[4px]">
                <div className="flex-1 bg-[#FFD600]" />
                <div className="flex-1 bg-[#0A0A0A]" />
                <div className="flex-1 bg-[#FFD600]" />
                <div className="flex-1 bg-[#0A0A0A]" />
                <div className="flex-1 bg-[#FFD600]" />
              </div>

              <div className="flex flex-col gap-8 p-8 md:p-[40px]">
                {/* Header */}
                <div className="flex flex-col gap-[10px]">
                  <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[3px]">
                    [01] // SIGN IN
                  </span>
                  <h2 className="font-grotesk text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1]">
                    WELCOME BACK.
                  </h2>
                  <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px] leading-[1.6]">
                    SIGN IN TO YOUR WORKSPACE AND PICK UP WHERE YOU LEFT OFF.
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-[12px]">
                  <div className="flex-1 h-px bg-[#1E1E1E]" />
                  <div className="flex items-center gap-[6px]">
                    <LockIcon />
                    <span className="font-ibm-mono text-[9px] text-[#333] tracking-[2px]">
                      SECURE AUTH
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-[#1E1E1E]" />
                </div>

                {/* Google button */}
                <button
                  className="flex items-center justify-between cursor-pointer w-full h-[56px] px-[20px] bg-[#111111] border-2 transition-all duration-200 group"
                  style={{
                    borderColor: hovering ? "#FFD600" : "#2D2D2D",
                  }}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  onClick={handleGoogleLogin}
                  disabled={isPending}
                >
                  <div className="flex items-center justify-center sm:gap-[14px] gap-[7px] w-full">
                    <GoogleIcon />
                    <span
                      className="font-ibm-mono text-[11px] tracking-[2px] transition-colors duration-200 whitespace-nowrap"
                      style={{ color: hovering ? "#F5F5F0" : "#888888" }}
                    >

                      {isLoading ? "Authenticating..." : "CONTINUE WITH GOOGLE"}
                    </span>
                  </div>
                  <span> {isError && (
                    <p>Authentication failed. Please try again.</p>
                  )}</span>
                  <span
                    className="transition-colors duration-200"
                    style={{ color: hovering ? "#FFD600" : "#333" }}
                  >
                    <ArrowRightIcon />
                  </span>
                </button>

                {/* Trust line */}
                <div className="flex items-center gap-[10px]">
                  <ShieldIcon />
                  <span className="font-ibm-mono text-[10px] text-[#444] tracking-[1px] leading-normal">
                    YOUR DATA IS ENCRYPTED AND NEVER SHARED. OAUTH 2.0 SECURED.
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#1E1E1E]" />

                {/* Footer links */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="font-ibm-mono text-[10px] text-[#444] tracking-[1px] hover:text-[#F5F5F0] transition-colors"
                  >
                    PRIVACY POLICY
                  </a>
                  <span className="font-ibm-mono text-[10px] text-[#2D2D2D]">//</span>
                  <a
                    href="#"
                    className="font-ibm-mono text-[10px] text-[#444] tracking-[1px] hover:text-[#F5F5F0] transition-colors"
                  >
                    TERMS OF SERVICE
                  </a>
                  <span className="font-ibm-mono text-[10px] text-[#2D2D2D]">//</span>
                  <a
                    href="#"
                    className="font-ibm-mono text-[10px] text-[#444] tracking-[1px] hover:text-[#F5F5F0] transition-colors"
                  >
                    HELP
                  </a>
                </div>
              </div>

              {/* Card status bar */}
              <div className="flex items-center justify-between px-[20px] h-[36px] border-t border-[#1E1E1E] bg-[#0A0A0A]">
                <div className="flex items-center gap-[8px]">
                  <div className="pulse-dot w-[6px] h-[6px] rounded-full bg-[#4ADE80]" />
                  <span className="font-ibm-mono text-[9px] text-[#444] tracking-[1.5px]">
                    ALL SYSTEMS OPERATIONAL
                  </span>
                </div>
                <span className="font-ibm-mono text-[9px] font-bold text-[#FFD600] tracking-[1px]">
                  V1.0.0
                </span>
              </div>
            </div>

            {/* Below card */}
            <div className="flex items-center justify-center gap-[8px] pt-[24px]">
              <span className="font-ibm-mono text-[11px] text-[#444] tracking-[1px]">
                NO ACCOUNT YET?
              </span>
              <Link
                href="/signup"
                className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[1px] hover:underline"
              >
                CREATE ONE FREE &gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
