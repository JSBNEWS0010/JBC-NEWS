import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TelegramBanner() {
  return (
    <div className="mb-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-6">
          <h2 className="text-xl font-serif font-bold mb-2">
            Get the JBC NEWS Telegram Bot
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Stay updated with real-time news alerts directly in your Telegram app.
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://t.me/jbcnewsbot" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition flex items-center">
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
                Connect with Bot
              </Button>
            </a>
            <Link href="/telegram-bot">
              <Button variant="outline" className="bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-600 font-medium py-2 px-4 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-600 transition">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md">
          <div className="relative">
            <div className="w-40 h-40 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-16 h-16 text-neutral-500 dark:text-neutral-400"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01" />
                <path d="M17 7h.01" />
                <path d="M7 17h.01" />
                <path d="M17 17h.01" />
                <path d="M12 12h.01" />
                <path d="M17 12h.01" />
                <path d="M7 12h.01" />
                <path d="M12 17h.01" />
                <path d="M12 7h.01" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 text-white"
              >
                <path d="M21.5 7.5 2.9 16.7l3.8.9 2.2 4.7L12 14l9.5-6.5Z" />
                <path d="M10 14 2.9 16.7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
