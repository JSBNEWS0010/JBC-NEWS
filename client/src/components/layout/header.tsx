import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <span className="text-xl font-bold">JBC News</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/news/latest">
              <span className="hover:text-primary">Latest</span>
            </Link>

            {user ? (
              <>
                {user.userType === "admin" && (
                  <Link href="/admin">
                    <span className="hover:text-primary">Admin</span>
                  </Link>
                )}
                {user.userType === "staff" && (
                  <Link href="/staff">
                    <span className="hover:text-primary">Staff</span>
                  </Link>
                )}
                <Link href="/user">
                  <span className="hover:text-primary">Profile</span>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <span className="hover:text-primary">Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}