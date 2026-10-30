import { Header } from "@/components/header/header";
import { HeroSection } from "@/components/hero/hero-section";
import { WorkflowSection } from "@/components/workflow/workflow-section";
import { SupportSection } from "@/components/support/support-section";
import { FeaturesSection } from "@/components/features/features-section";
import { BenefitsSection } from "@/components/benefits/benefits-section";
import { ProcessSection } from "@/components/process/process-section";
import { ContactSection } from "@/components/contact/contact-section";
import { Footer } from "@/components/footer/footer";
import { AnchorFocus } from "@/components/navigation/anchor-focus";

export default function Home() {
  return <div className="landing" id="home"><AnchorFocus /><a className="skip-link" href="#main-content">본문으로 이동</a><div className="landing-glows" aria-hidden="true" /><Header /><main id="main-content"><HeroSection /><WorkflowSection /><SupportSection /><FeaturesSection /><BenefitsSection /><ProcessSection /><ContactSection /></main><Footer /></div>;
}
