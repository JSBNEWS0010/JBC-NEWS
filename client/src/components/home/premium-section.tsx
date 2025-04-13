import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckIcon } from "lucide-react";

export default function PremiumSection() {
  const benefits = [
    "Ad-free experience across web and Telegram",
    "Exclusive in-depth analysis and special reports",
    "Breaking news alerts before general public",
    "Direct access to journalists via members-only events",
  ];

  return (
    <div className="mb-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 text-white">
          <div className="inline-block bg-accent text-primary font-bold px-4 py-1 rounded-full mb-4">
            PREMIUM
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Unlock Exclusive Content
          </h2>
          <ul className="mb-6 space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckIcon className="text-accent mr-2 mt-1 h-5 w-5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <Link href="/user/subscription">
            <Button className="bg-accent hover:bg-accent-dark text-primary font-medium">
              Subscribe Now
            </Button>
          </Link>
        </div>
        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            className="w-full h-full object-cover"
            alt="Premium content"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary opacity-60"></div>
        </div>
      </div>
    </div>
  );
}
