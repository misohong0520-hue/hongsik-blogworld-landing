import { Header } from "@/components/header/header";
import { HeroSection } from "@/components/hero/hero-section";
import { QuickFeaturesSection, OperatorProblemsSection, PlatformsSection, CompactProcessSection } from "@/components/overview/overview-sections";
import { FeatureJourney } from "@/components/journey/feature-journey";
import { ContactSection } from "@/components/contact/contact-section";
import { Footer } from "@/components/footer/footer";
import { AnchorFocus } from "@/components/navigation/anchor-focus";

export default function Home() {
  return <div className="landing" id="home"><AnchorFocus /><a className="skip-link" href="#main-content">본문으로 이동</a><div className="landing-glows" aria-hidden="true" /><Header /><main id="main-content"><HeroSection /><QuickFeaturesSection /><OperatorProblemsSection /><FeatureJourney /><PlatformsSection /><CompactProcessSection /><ContactSection /></main><Footer /></div>;
}
