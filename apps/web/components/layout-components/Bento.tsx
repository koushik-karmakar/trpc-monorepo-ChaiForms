import SectionHeader from "./SectionHeader";

export default function Bento() {
  return (
    <section className="flex flex-col w-full bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-10 md:gap-[48px]">
      <SectionHeader
        label="[05] // CAPABILITIES"
        title={"THE FULL FORM\nSTACK."}
        titleWidth="w-full max-w-[800px]"
      />

      <div className="flex flex-col w-full gap-[2px]">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row w-full gap-[2px]">
          {/* Bento A — Yellow */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#FFD600] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#1A1A1A] tracking-[2px]">
              [01]
            </span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"REAL-TIME\nCOLLABORATION"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#1A1A1A] tracking-[1px] leading-[1.6]">
              MULTIPLE EDITORS. ONE FORM. LIVE CURSORS, LIVE EDITS, ZERO CONFLICTS.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#0A0A0A] w-fit">
              <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
                [LIVE]
              </span>
            </div>
          </div>

          {/* Bento B */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#111111] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">
              [02]
            </span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"RESPONSE\nINBOX"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              EVERY SUBMISSION IN ONE PLACE. FILTER, SEARCH, EXPORT TO CSV IN ONE CLICK.
            </p>
          </div>

          {/* Bento C */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#0A0A0A] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">
              [03]
            </span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"WEBHOOK\n& API"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              CONNECT TO ZAPIER, SLACK, NOTION, OR HIT YOUR OWN ENDPOINT ON EVERY SUBMISSION.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border border-[#FF6B35] w-fit">
              <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
                [OPEN]
              </span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row w-full gap-[2px]">
          {/* Bento D */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#111111] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">
              [04]
            </span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"CUSTOM\nTHEMES"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              DARK // LIGHT // BRANDED. YOUR FORM LOOKS LIKE YOUR PRODUCT, NOT A GOOGLE DOC.
            </p>
          </div>

          {/* Bento E */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#0F0F0F] border-2 border-[#FF6B35] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FF6B35] tracking-[2px]">
              [05]
            </span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"AI-POWERED\nFIELD SUGGESTIONS"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              DESCRIBE YOUR FORM IN ONE SENTENCE. AI GENERATES THE FIELDS, LOGIC, AND ORDER.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border border-[#FF6B35] w-fit">
              <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
                [AI]
              </span>
            </div>
          </div>

          {/* Bento F */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#0A0A0A] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">
              [06]
            </span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"COMPLETION\nANALYTICS"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              DROP-OFF RATES. DEVICE SPLIT. TIME-TO-COMPLETE. ALL THE METRICS THAT MATTER.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
