"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const faqs = [
  {
    question: "IS FORMCRAFT FREE TO USE?",
    answer:
      "YES. THE FREE PLAN INCLUDES UNLIMITED FORMS, UP TO 100 RESPONSES PER MONTH, AND ALL CORE FIELD TYPES. NO CREDIT CARD REQUIRED. UPGRADE WHEN YOU NEED MORE.",
    defaultOpen: true,
  },
  {
    question: "WHAT FIELD TYPES ARE SUPPORTED?",
    answer:
      "SHORT TEXT, LONG TEXT, EMAIL, NUMBER, SINGLE SELECT, MULTI SELECT, CHECKBOX, RATING, DATE, FILE UPLOAD, AND MORE. CONDITIONAL LOGIC WORKS ACROSS ALL TYPES.",
  },
  {
    question: "CAN I EMBED FORMS ON MY WEBSITE?",
    answer:
      "YES. COPY A SINGLE SCRIPT TAG AND YOUR FORM EMBEDS INLINE, AS A POPUP, OR AS A FULL PAGE. WORKS WITH REACT, NEXT.JS, WEBFLOW, AND ANY HTML PAGE.",
  },
  {
    question: "HOW DO I EXPORT RESPONSES?",
    answer:
      "ONE CLICK CSV EXPORT FROM YOUR DASHBOARD. OR CONNECT TO GOOGLE SHEETS, NOTION, AIRTABLE VIA WEBHOOK — RESPONSES SYNC IN REAL TIME.",
  },
  {
    question: "IS THERE A RESPONSE LIMIT ON FREE?",
    answer:
      "FREE PLAN SUPPORTS 100 RESPONSES/MONTH PER FORM. PRO REMOVES ALL LIMITS. ENTERPRISE INCLUDES DEDICATED INFRASTRUCTURE AND SLA.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="flex flex-col w-full bg-[#060606] py-16 px-6 md:py-[100px] md:px-[120px]"
    >
      <div className="w-full max-w-[480px]">
        <SectionHeader
          label="[08] // FAQ"
          title={"GOT\nQUESTIONS?"}
          subtitle="EVERYTHING YOU NEED TO KNOW BEFORE SHIPPING YOUR FIRST PIXEL."
          titleWidth="w-full"
          subtitleWidth="w-full"
        />
      </div>

      <div className="h-10 md:h-[64px]" />

      {/* FAQ items */}
      <div className="flex flex-col w-full">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="flex flex-col w-full border-t border-t-[#1D1D1D]">
              <button
                className="flex items-center justify-between w-full py-5 md:h-[72px] text-left gap-4"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
              >
                <span className="font-grotesk text-[14px] md:text-[16px] font-bold text-[#F5F5F0] tracking-[1px]">
                  {faq.question}
                </span>
                <div
                  className="flex items-center justify-center w-[32px] h-[32px] shrink-0"
                  style={{
                    backgroundColor: isOpen ? "#FFD600" : "#1A1A1A",
                    border: isOpen ? "none" : "1px solid #3D3D3D",
                  }}
                >
                  <span
                    className="font-ibm-mono text-[14px] font-bold"
                    style={{ color: isOpen ? "#0A0A0A" : "#888888" }}
                  >
                    {isOpen ? "—" : "+"}
                  </span>
                </div>
              </button>
              {isOpen && faq.answer && (
                <div className="pb-8">
                  <p className="font-ibm-mono text-[12px] md:text-[13px] text-[#888888] tracking-[1px] leading-[1.6]">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div className="border-t border-t-[#1D1D1D]" />
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-[16px] pt-10 md:pt-[48px]">
        <span className="font-ibm-mono text-[13px] text-[#555555] tracking-[1px]">
          STILL HAVE QUESTIONS?
        </span>
        <span className="font-ibm-mono text-[13px] font-bold text-[#FFD600] tracking-[1px] cursor-pointer hover:underline">
          TALK TO A HUMAN &gt;
        </span>
      </div>
    </section>
  );
}
