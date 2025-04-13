import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Globe, 
  Menu, 
  Moon, 
  Sun, 
  User,
  ChevronDown,
  LogOut
} from "lucide-react";

const languages = [
  { code: "english", label: "English" },
  { code: "hindi", label: "हिन्दी (Hindi)" },
  { code: "urdu", label: "اردو (Urdu)" }
];

export default function Header() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">JBC</span>
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-primary dark:text-white">
                  JBC <span className="text-secondary">NEWS</span>
                </h1>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  by AYYAN CORPORATION
                </p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <a className={`font-medium ${location === "/" ? "text-primary dark:text-secondary" : "text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary"}`}>
                Home
              </a>
            </Link>
            <Link href="/news/category/politics">
              <a className="text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium">
                Politics
              </a>
            </Link>
            <Link href="/news/category/entertainment">
              <a className="text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium">
                Entertainment
              </a>
            </Link>
            <Link href="/news/category/sports">
              <a className="text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium">
                Sports
              </a>
            </Link>
            <Link href="/news/category/alerts">
              <a className="text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium">
                Alerts
              </a>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium flex items-center">
                More <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/news/category/technology">
                    <a className="w-full">Technology</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/news/category/health">
                    <a className="w-full">Health</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/news/category/business">
                    <a className="w-full">Business</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/news/category/science">
                    <a className="w-full">Science</a>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code}>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-neutral-300" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-600" />
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={`/${user.userType}`}>
                      <a className="w-full">Dashboard</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="hidden md:block bg-primary hover:bg-primary-dark text-white transition">
                  Login
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 shadow-md">
          <div className="px-4 py-3 space-y-2">
            <Link href="/">
              <a className="block text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium p-2">
                Home
              </a>
            </Link>
            <Link href="/news/category/politics">
              <a className="block text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium p-2">
                Politics
              </a>
            </Link>
            <Link href="/news/category/entertainment">
              <a className="block text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium p-2">
                Entertainment
              </a>
            </Link>
            <Link href="/news/category/sports">
              <a className="block text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium p-2">
                Sports
              </a>
            </Link>
            <Link href="/news/category/alerts">
              <a className="block text-neutral-700 dark:text-neutral-100 hover:text-primary dark:hover:text-secondary font-medium p-2">
                Alerts
              </a>
            </Link>
            {!user && (
              <Link href="/auth">
                <Button className="w-full mt-4 bg-primary hover:bg-primary-dark text-white transition">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
