import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BreakingNews from "@/components/home/breaking-news";
import TimeDisplay from "@/components/home/time-display";
import HeroSection from "@/components/home/hero-section";
import LiveCoverage from "@/components/home/live-coverage";
import TopStories from "@/components/home/top-stories";
import CategoryTabs from "@/components/home/category-tabs";
import PremiumSection from "@/components/home/premium-section";
import RegionalNews from "@/components/home/regional-news";
import TelegramBanner from "@/components/home/telegram-banner";
import { useTitle } from "@/hooks/use-title";

export default function HomePage() {
  // Set document title
  useTitle("JBC NEWS - Your Trusted Source for Global News");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreakingNews />
      <TimeDisplay />
      <main className="flex-grow">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LiveCoverage />
          <TopStories />
          <CategoryTabs />
          <PremiumSection />
          <RegionalNews />
          <TelegramBanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}
