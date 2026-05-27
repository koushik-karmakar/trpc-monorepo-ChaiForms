"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
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

function StarIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="#FFD600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}

const BENEFITS = [
  "FREE FOREVER — NO CREDIT CARD",
  "UNLIMITED FORMS ON FREE PLAN",
  "SETUP IN UNDER 5 MINUTES",
  "CONDITIONAL LOGIC INCLUDED",
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

const SOCIAL_PROOF = [
  { val: "50K+", lbl: "USERS" },
  { val: "4.9★", lbl: "RATING" },
  { val: "FREE", lbl: "TO START" },
];



export default function Signup() {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [checked, setChecked] = useState(false);
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

  const handleGoogleSignIn = () => {
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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=IBM+Plex+Mono:wght@400;700&display=swap');
        @keyframes scan { 0%{transform:translateY(-100vh)} 100%{transform:translateY(100vh)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes float {
          0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)}
        }
        .scan-line { animation: scan 6s linear infinite; }
        .ticker-track { animation: ticker 20s linear infinite; }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        .fade-up-1 { animation: fade-up .5s ease both .1s; }
        .fade-up-2 { animation: fade-up .5s ease both .25s; }
        .fade-up-3 { animation: fade-up .5s ease both .4s; }
        .fade-up-4 { animation: fade-up .5s ease both .55s; }
        .fade-up-5 { animation: fade-up .5s ease both .7s; }
        .float-badge { animation: float 3s ease-in-out infinite; }
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .font-ibm-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* ── Top navbar ── */}
      <header className="flex items-center justify-between h-[60px] px-6 md:px-[48px] border-b border-[#1E1E1E] shrink-0">
        <Link href="/" className="flex items-center gap-[10px] group">
          <span
            className="w-[10px] h-[10px] bg-[#FFD600] group-hover:scale-110 transition-transform"
            style={{ display: "inline-block" }}
          />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            FORMCRAFT
          </span>
        </Link>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL — Sign-up Card ── */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 relative">
          {/* Subtle radial bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 40% 30%, rgba(255,214,0,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(74,222,128,0.02) 0%, transparent 50%)",
            }}
          />

          <div
            className={`relative z-10 flex flex-col w-full max-w-[420px] ${mounted ? "fade-up-2" : "opacity-0"}`}
          >
            {/* Floating badge */}
            <div className="flex justify-center mb-6">
              <div className="float-badge flex items-center gap-[8px] h-[28px] px-[14px] bg-[#1A1A1A] border border-[#FFD600]">
                <StarIcon />
                <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
                  JOIN 50,000+ BUILDERS
                </span>
              </div>
            </div>

            {/* Card */}
            <div className="flex flex-col gap-0 bg-[#0F0F0F] border border-[#2D2D2D]">
              {/* Accent bar */}
              <div className="flex h-[4px]">
                <div className="flex-1 bg-[#FFD600]" />
                <div className="flex-1 bg-[#0A0A0A]" />
                <div className="flex-1 bg-[#FF6B35]" />
                <div className="flex-1 bg-[#0A0A0A]" />
                <div className="flex-1 bg-[#FFD600]" />
              </div>

              <div className="flex flex-col gap-7 p-8 md:p-[40px]">
                {/* Header */}
                <div className="flex flex-col gap-[10px]">
                  <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[3px]">
                    [01] // CREATE ACCOUNT
                  </span>
                  <h2 className="font-grotesk text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1]">
                    START BUILDING.
                  </h2>
                  <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px] leading-[1.6]">
                    FREE FOREVER. NO CREDIT CARD. FIRST FORM LIVE IN MINUTES.
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-[12px]">
                  <div className="flex-1 h-px bg-[#1E1E1E]" />
                  <div className="flex items-center gap-[6px]">
                    <LockIcon />
                    <span className="font-ibm-mono text-[9px] text-[#333] tracking-[2px]">
                      SECURE SIGNUP
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-[#1E1E1E]" />
                </div>

                {/* Google button */}
                <button
                  className="flex items-center justify-between cursor-pointer w-full h-[56px] px-[20px] bg-[#111111] border-2 transition-all duration-200"
                  style={{ borderColor: hovering ? "#FFD600" : "#2D2D2D" }}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  onClick={handleGoogleSignIn}
                  disabled={isPending}
                >
                  <div className="flex items-center justify-center sm:gap-[14px] gap-[7px] w-full">
                    <GoogleIcon />
                    <span
                      className="font-ibm-mono text-[11px] tracking-[2px] transition-colors duration-200"
                      style={{ color: hovering ? "#F5F5F0" : "#888888" }}
                    >
                      {isLoading ? "Authenticating..." : "SIGN UP WITH GOOGLE"}
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

                {/* Terms checkbox */}
                <div className="flex items-start gap-[12px]">
                  <button
                    onClick={() => setChecked((v) => !v)}
                    className="flex items-center justify-center w-[18px] h-[18px] shrink-0 mt-px border transition-colors duration-150"
                    style={{
                      backgroundColor: checked ? "#FFD600" : "#111111",
                      borderColor: checked ? "#FFD600" : "#3D3D3D",
                    }}
                  >
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="#0A0A0A"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[0.5px] leading-[1.6]">
                    I AGREE TO THE{" "}
                    <a href="#" className="text-[#FFD600] hover:underline">
                      TERMS OF SERVICE
                    </a>{" "}
                    AND{" "}
                    <a href="#" className="text-[#FFD600] hover:underline">
                      PRIVACY POLICY
                    </a>
                  </span>
                </div>

                {/* Trust line */}
                <div className="flex items-center gap-[10px]">
                  <ShieldIcon />
                  <span className="font-ibm-mono text-[10px] text-[#444] tracking-[1px] leading-normal">
                    OAUTH 2.0 SECURED. YOUR DATA IS ENCRYPTED AND NEVER SOLD.
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
                ALREADY HAVE AN ACCOUNT?
              </span>
              <Link
                href="/login"
                className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[1px] hover:underline"
              >
                LOG IN &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Benefits ── */}
        <div className="hidden lg:flex flex-col w-[480px] xl:w-[520px] shrink-0 bg-[#0D0D0D] border-l border-[#1E1E1E] relative overflow-hidden">
          {/* Scanline */}
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
              [WHY FORMCRAFT]
            </span>

            <div className="h-[32px]" />

            {/* Big headline */}
            <h1
              className={`font-grotesk text-[52px] xl:text-[60px] font-bold text-[#F5F5F0] tracking-[-2px] leading-[1.02] whitespace-pre-line ${mounted ? "fade-up-2" : "opacity-0"}`}
            >
              {"FORMS THAT\nFEEL LIKE"}
            </h1>
            <h1
              className={`font-grotesk text-[52px] xl:text-[60px] font-bold text-[#FFD600] tracking-[-2px] leading-[1.02] ${mounted ? "fade-up-3" : "opacity-0"}`}
            >
              PRODUCTS.
            </h1>

            <div className="h-[40px]" />

            {/* Benefits list */}
            <div className={`flex flex-col gap-[14px] ${mounted ? "fade-up-4" : "opacity-0"}`}>
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-[12px]">
                  <div className="flex items-center justify-center w-[20px] h-[20px] bg-[#1A1A1A] border border-[#FFD600] shrink-0">
                    <CheckIcon />
                  </div>
                  <span className="font-ibm-mono text-[11px] text-[#888888] tracking-[1px]">
                    {b}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-[40px]" />

            {/* Feature highlight card */}
            <div
              className={`flex flex-col gap-[12px] p-[24px] bg-[#111111] border border-[#2D2D2D] ${mounted ? "fade-up-4" : "opacity-0"}`}
            >
              <div className="flex items-center gap-[8px]">
                <div className="w-[6px] h-[6px] bg-[#FF6B35] shrink-0" />
                <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
                  [NEW] AI-POWERED
                </span>
              </div>
              <p className="font-ibm-mono text-[11px] text-[#666] tracking-[1px] leading-[1.6]">
                DESCRIBE YOUR FORM IN ONE SENTENCE. AI GENERATES THE FIELDS, LOGIC, AND ORDER IN
                SECONDS.
              </p>
            </div>

            <div className="flex-1" />

            {/* Stats row */}
            <div
              className={`flex items-center gap-0 border border-[#1E1E1E] ${mounted ? "fade-up-5" : "opacity-0"}`}
            >
              {SOCIAL_PROOF.map((s, i) => (
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
                  <span
                    className="w-[4px] h-[4px] bg-[#FFD600] opacity-50 shrink-0"
                    style={{ display: "inline-block" }}
                  />
                  <span className="font-ibm-mono text-[9px] text-[#333] tracking-[2px]">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


