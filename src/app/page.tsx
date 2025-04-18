import FloatingHeader from "@/components/FloatingHeader";
import Bubble from "@/components/Bubble";

import HorizontalSection from "@/components/HorizontalSection";
import Footer from "@/components/Footer";

import PartnersSection from "@/components/PartnersSection";

// import InfluencerSection from "@/components/Influencer";
import Influencer_Intro from "@/components/Influencer_Intro";
import Influencer_Cards from "@/components/Influencer_Cards";
// import CTAForm from "@/components/CTAForm";



export default function HomePage() {
  return (
    <main>
      <FloatingHeader />
      <Bubble />
      <HorizontalSection />
      <Influencer_Intro />
      <Influencer_Cards />
      {/* <InfluencerSection /> */}

      <PartnersSection />

      {/* <CTAForm /> */}
      <Footer />


    </main>
  );
}
