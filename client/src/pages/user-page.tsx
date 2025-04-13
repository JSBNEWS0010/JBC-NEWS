import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Profile from "@/components/user/profile";
import Subscription from "@/components/user/subscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  User,
  Bookmark,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  BellRing,
  MessageSquare,
  Send
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Telegram Integration Component
function TelegramIntegration({ user }) {
  const [telegramId, setTelegramId] = useState(user?.telegramId || "");
  const queryClient = useQueryClient();
  
  const linkTelegramMutation = useMutation({
    mutationFn: async (telegramId: string) => {
      const res = await apiRequest("POST", "/api/user/link-telegram", { telegramId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Success",
        description: "Your Telegram account has been linked successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to link Telegram",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleLinkTelegram = () => {
    if (!telegramId.trim()) {
      toast({
        title: "Telegram ID Required",
        description: "Please enter your Telegram ID",
        variant: "destructive",
      });
      return;
    }
    
    linkTelegramMutation.mutate(telegramId);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Telegram Integration</CardTitle>
        <CardDescription>
          Link your Telegram account to receive news alerts and updates directly on Telegram
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.telegramId ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <p className="text-green-700 dark:text-green-400 font-medium">
              Your Telegram account (ID: {user.telegramId}) is linked!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You will now receive news updates and notifications on Telegram.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To link your Telegram account, find our bot @JBCNewsBot on Telegram and get your Telegram ID.
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your Telegram ID"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                />
                <Button 
                  onClick={handleLinkTelegram}
                  disabled={linkTelegramMutation.isPending}
                >
                  {linkTelegramMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Linking...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Link Account
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-xs text-muted-foreground">
          By linking your Telegram account, you'll receive breaking news alerts, daily digests,
          and premium content notifications directly on Telegram.
        </p>
      </CardFooter>
    </Card>
  );
}
import { Link } from "wouter";

export default function UserPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "JBC NEWS - User Dashboard";
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
                  JBC <span className="text-secondary">USER</span>
                </h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "profile" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "subscription" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("subscription")}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Subscription
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "bookmarks" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("bookmarks")}
            >
              <Bookmark className="mr-2 h-5 w-5" />
              Bookmarks
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "notifications" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <BellRing className="mr-2 h-5 w-5" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "support" ? "bg-primary-light" : ""
              }`}
              onClick={() => setActiveTab("support")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Support
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
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="font-medium">{user?.username || "User"}</p>
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
          <h1 className="text-3xl font-serif font-bold mb-6">User Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile">
              <Profile user={user} />
            </TabsContent>
            <TabsContent value="subscription">
              <Subscription />
            </TabsContent>
            <TabsContent value="bookmarks">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Your Bookmarks</h2>
                <p className="text-muted-foreground">You don't have any bookmarked articles yet.</p>
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold">Notifications</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Web Notifications</h3>
                      <p className="text-muted-foreground text-sm">
                        Configure your in-app notification preferences
                      </p>
                    </div>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                          You have no new web notifications.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Telegram Integration</h3>
                      <p className="text-muted-foreground text-sm">
                        Link your Telegram account for instant notifications
                      </p>
                    </div>
                    <TelegramIntegration user={user} />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="support">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Support</h2>
                <p className="text-muted-foreground">Contact us for assistance or submit support requests.</p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
