import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative py-8 bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-4">
              Your Trusted Source for Global News
            </h2>
            <p className="text-lg mb-6">
              Hyperlocal and international coverage in your preferred language,
              powered by AI and human expertise.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/news/latest">
                <Button className="bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-6 rounded-md transition">
                  Latest News
                </Button>
              </Link>
              <Link href="/telegram-bot">
                <Button variant="outline" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-6 rounded-md transition flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2"
                  >
                    <path d="M21.5 7.5 2.9 16.7l3.8.9 2.2 4.7L12 14l9.5-6.5Z" />
                    <path d="M10 14 2.9 16.7" />
                  </svg>
                  Join on Telegram
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative">
            <img
              src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="News imagery"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 right-4 flex space-x-3">
              <span className="bg-secondary text-white text-xs py-1 px-3 rounded-full">
                LIVE
              </span>
              <span className="bg-white bg-opacity-90 text-primary text-xs py-1 px-3 rounded-full">
                PREMIUM
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-100 dark:from-neutral-900 to-transparent"></div>
    </section>
  );
}
