import { useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AuthForm from "@/components/auth/auth-form";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function AuthPage() {
  const { user, isLoading } = useAuth();

  // Set document title
  useEffect(() => {
    document.title = "JBC NEWS - Login or Register";
  }, []);

  // Redirect to appropriate dashboard if already logged in
  if (user && !isLoading) {
    const redirectPath = 
      user.userType === "admin" ? "/admin" :
      user.userType === "staff" ? "/staff" : "/user";
    
    return <Redirect to={redirectPath} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Auth Forms */}
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md">
              <h1 className="text-3xl font-serif font-bold mb-6 text-primary dark:text-white">
                Welcome to JBC NEWS
              </h1>
              <AuthForm />
            </div>

            {/* Hero Section */}
            <div className="hidden md:block bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-lg">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Join the Global News Community
              </h2>
              <p className="text-lg mb-6">
                Get access to premium content, personalized news feeds, and exclusive features tailored to your preferences.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent mr-2 mt-1 h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Personalized news feed based on your interests</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent mr-2 mt-1 h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Content in your preferred language</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent mr-2 mt-1 h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Instant notifications via Telegram</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent mr-2 mt-1 h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Regional news tailored to your location</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
