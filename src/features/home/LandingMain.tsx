import {
  CollaborationSection,
  CommunicationFeaturesSection,
  FinalCalloutSection,
  ManagementFeaturesSection,
  PerformanceCalloutSection,
  ProductivitySection,
} from "./landing-main/FeatureSections"
import {
  CompanyLogosSection,
  LandingHeroSection,
} from "./landing-main/HeroAndLogosSections"
import { TestimonialsSection } from "./landing-main/TestimonialsSection"

export default function LandingMain() {
  return (
    <>
      <LandingHeroSection />
      <CompanyLogosSection />
      <CommunicationFeaturesSection />
      <ManagementFeaturesSection />
      <PerformanceCalloutSection />
      <CollaborationSection />
      <ProductivitySection />
      <FinalCalloutSection />
      <TestimonialsSection />
    </>
  )
}
