"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const slides = [
  {
    tag: "[USER RESEARCH]",
    tagBg: "#FFD600",
    tagColor: "#0A0A0A",
    idx: "01 / 04",
    title: "AXIOM PRODUCT\nFEEDBACK FORM",
    by: "BY AXIOM INC // 2,400 RESPONSES IN FIRST WEEK",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "[NPS SURVEY]",
    tagBg: "#111111",
    tagColor: "#FFD600",
    idx: "02 / 04",
    title: "FORGE NET PROMOTER\nSCORE FLOW",
    by: "BY FORGE LAB // 89% COMPLETION RATE",
    tagBorder: "#FFD600",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "[ONBOARDING]",
    tagBg: "#1A1A1A",
    tagColor: "#FF6B35",
    idx: "03 / 04",
    title: "NEXUS USER\nONBOARDING SURVEY",
    by: "BY NEXUS CO. // BUILT IN 20 MINUTES",
    tagBorder: "#FF6B35",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "[LEAD GEN]",
    tagBg: "#FFD600",
    tagColor: "#0A0A0A",
    idx: "04 / 04",
    title: "VORTEX WAITLIST\nSIGNUP FORM",
    by: "BY VORTEX SYS // 5,000 LEADS CAPTURED",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Showcase() {
  const [active, setActive] = useState(1);

  const prev = () => setActive((p) => Math.max(0, p - 1));
  const next = () => setActive((p) => Math.min(slides.length - 1, p + 1));

  const slide = slides[active];

  return (
    <section
      id="showcase"
      className="flex flex-col w-full bg-[#080808] pt-16 md:pt-[100px] pb-0 gap-8 md:gap-[48px]"
    >
      {/* Header */}
      <div className="flex items-end justify-between px-6 md:px-[120px]">
        <SectionHeader
          label="[07] // SHOWCASE"
          title={"BUILT WITH\nFORMCRAFT."}
          titleWidth="w-full max-w-[600px]"
        />
        <div className="flex items-center gap-[8px] shrink-0">
          <button
            onClick={prev}
            className="flex items-center justify-center w-[48px] h-[48px] bg-[#111111] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors"
          >
            <span className="font-grotesk text-[18px] font-bold text-[#888888]">&lt;</span>
          </button>
          <button
            onClick={next}
            className="flex items-center justify-center w-[48px] h-[48px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors"
          >
            <span className="font-grotesk text-[18px] font-bold text-[#0A0A0A]">&gt;</span>
          </button>
        </div>
      </div>

      {/* Mobile: single card */}
      <div className="md:hidden px-6">
        <div
          className="flex flex-col gap-5 p-6 border-2 w-full"
          style={{ backgroundColor: slide!.tagBg, borderColor: slide!.tagBorder }}
        >
          <div className="h-[200px] overflow-hidden border border-[#2D2D2D] bg-[#1A1A1A]">
            <img src={slide!.image} alt={slide!.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-center h-[24px] px-[10px] border"
              style={{
                backgroundColor: slide!.tagBg,
                borderColor: slide!.tagBorder || "transparent",
              }}
            >
              <span
                className="font-ibm-mono text-[9px] font-bold tracking-[1px]"
                style={{ color: slide!.tagColor }}
              >
                {slide!.tag}
              </span>
            </div>
            <span
              className="font-ibm-mono text-[11px] tracking-[2px]"
              style={{ color: slide!.tagColor }}
            >
              {slide!.idx}
            </span>
          </div>
          <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
            {slide!.title}
          </h3>
          <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">{slide!.by}</p>
        </div>
      </div>

      {/* Desktop: carousel track */}
      <div className="hidden md:overflow-hidden h-[416px] md:block px-[120px]">
        <div
          className="flex gap-[2px] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(-${active} * (560px + 2px)))` }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="flex flex-col gap-[24px] p-[40px] h-[412px] w-[560px] shrink-0 border-2"
              style={{ backgroundColor: s.tagBg, borderColor: s.tagBorder }}
            >
              <div className="h-[200px] overflow-hidden border border-[#2D2D2D] bg-[#1A1A1A]">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between w-full">
                <div
                  className="flex items-center justify-center h-[24px] px-[10px] border"
                  style={{ backgroundColor: s.tagBg, borderColor: s.tagBorder || "transparent" }}
                >
                  <span
                    className="font-ibm-mono text-[9px] font-bold tracking-[1px]"
                    style={{ color: s.tagColor }}
                  >
                    {s.tag}
                  </span>
                </div>
                <span
                  className="font-ibm-mono text-[11px] tracking-[2px]"
                  style={{ color: s.tagColor }}
                >
                  {s.idx}
                </span>
              </div>
              <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
                {s.title}
              </h3>
              <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">{s.by}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-[8px] px-6 md:px-[120px]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-[4px] transition-all"
            style={{
              width: i === active ? 32 : 8,
              backgroundColor: i === active ? "#FFD600" : "#333333",
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 md:px-[120px] pb-16 md:pb-[100px]">
        <span className="font-ibm-mono text-[11px] text-[#444444] tracking-[2px]">
          SHOWING 0{active + 1} OF 04 PROJECTS
        </span>
        <span className="font-ibm-mono text-[11px] text-[#FFD600] tracking-[2px] cursor-pointer hover:underline">
          VIEW ALL &gt;
        </span>
      </div>
    </section>
  );
}
