import Navbar from "../../web/components/layout-components/Navbar";
import Hero from "../../web/components/layout-components/Hero";
import PixelDivider from "../../web/components/layout-components/PixelDivider";
import Logos from "../../web/components/layout-components/Logos";
import Features from "../../web/components/layout-components/Features";
import HowItWorks from "../../web/components/layout-components/HowItWorks";
import Stats from "../../web/components/layout-components/Stats";
import Testimonials from "../../web/components/layout-components/Testimonials";
import Bento from "../../web/components/layout-components/Bento";
import Comparison from "../../web/components/layout-components/CollabCursors";
import Showcase from "../../web/components/layout-components/Showcase";
import FAQ from "../../web/components/layout-components/FAQ";
import Pricing from "../../web/components/layout-components/Pricing";
import FinalCTA from "../../web/components/layout-components/FinalCTA";
import Footer from "../../web/components/layout-components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      <Navbar />
      <Hero />
      <PixelDivider />
      <Logos />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Bento />
      <Comparison />
      <Showcase />
      <FAQ />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
