import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Dashboard from "@/components/admin/dashboard";
import UserManagement from "@/components/admin/user-management";
import SubscriptionManagement from "@/components/admin/subscription-management";
import Analytics from "@/components/admin/analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Users,
  BarChart3,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link } from "wouter";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "JBC NEWS - Admin Dashboard";
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-primary-light">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary text-lg font-bold">JBC</span>
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold">
                  JBC <span className="text-secondary">ADMIN</span>
                </h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "dashboard" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "users" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-5 w-5" />
              User Management
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "subscriptions" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("subscriptions")}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Subscriptions
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "support" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("support")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Support Tickets
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "analytics" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Analytics
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "settings" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>

          <div className="p-4 border-t border-primary-light">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <span className="font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div>
                <p className="font-medium">{user?.username || "Admin User"}</p>
                <p className="text-xs text-neutral-300">{user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm" className="flex-1">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            <TabsContent value="subscriptions">
              <SubscriptionManagement />
            </TabsContent>
            <TabsContent value="support">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Support Tickets</h2>
                <p className="text-muted-foreground">This feature is coming soon.</p>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Settings</h2>
                <p className="text-muted-foreground">System settings will be available here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
