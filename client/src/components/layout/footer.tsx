import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary text-lg font-bold">JBC</span>
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold">
                  JBC <span className="text-secondary">NEWS</span>
                </h2>
                <p className="text-xs text-neutral-300">by AYYAN CORPORATION</p>
              </div>
            </div>
            <p className="text-neutral-300 mb-4">
              Your trusted source for global and hyperlocal news, powered by AI and
              human expertise.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-secondary"
                aria-label="Telegram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M21.5 7.5 2.9 16.7l3.8.9 2.2 4.7L12 14l9.5-6.5Z" />
                  <path d="M10 14 2.9 16.7" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-secondary"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-secondary"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-secondary"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/news/category/politics">
                  <a className="text-neutral-300 hover:text-white">Politics</a>
                </Link>
              </li>
              <li>
                <Link href="/news/category/business">
                  <a className="text-neutral-300 hover:text-white">Business</a>
                </Link>
              </li>
              <li>
                <Link href="/news/category/technology">
                  <a className="text-neutral-300 hover:text-white">Technology</a>
                </Link>
              </li>
              <li>
                <Link href="/news/category/sports">
                  <a className="text-neutral-300 hover:text-white">Sports</a>
                </Link>
              </li>
              <li>
                <Link href="/news/category/entertainment">
                  <a className="text-neutral-300 hover:text-white">Entertainment</a>
                </Link>
              </li>
              <li>
                <Link href="/news/category/health">
                  <a className="text-neutral-300 hover:text-white">Health</a>
                </Link>
              </li>
              <li>
                <Link href="/news/category/science">
                  <a className="text-neutral-300 hover:text-white">Science</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/user/subscription">
                  <a className="text-neutral-300 hover:text-white">Premium Subscription</a>
                </Link>
              </li>
              <li>
                <Link href="/telegram-bot">
                  <a className="text-neutral-300 hover:text-white">Telegram Bot</a>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <a className="text-neutral-300 hover:text-white">Support</a>
                </Link>
              </li>
              <li>
                <Link href="/advertise">
                  <a className="text-neutral-300 hover:text-white">Advertise</a>
                </Link>
              </li>
              <li>
                <Link href="/press">
                  <a className="text-neutral-300 hover:text-white">Press Releases</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-neutral-300 hover:text-white">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-neutral-300 hover:text-white">Careers</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <a className="text-neutral-300 hover:text-white">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-neutral-300 hover:text-white">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-300 hover:text-white">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400">© 2024 JBC NEWS. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
              <Link href="/privacy-policy">
                <a className="text-neutral-400 hover:text-white text-sm">Privacy Policy</a>
              </Link>
              <Link href="/terms">
                <a className="text-neutral-400 hover:text-white text-sm">Terms of Service</a>
              </Link>
              <Link href="/cookie-policy">
                <a className="text-neutral-400 hover:text-white text-sm">Cookie Policy</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
