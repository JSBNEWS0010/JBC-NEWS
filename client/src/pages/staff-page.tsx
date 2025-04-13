import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import ContentManagement from "@/components/staff/content-management";
import NewsEditor from "@/components/staff/news-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  FileText,
  PenTool,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { Link } from "wouter";

export default function StaffPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("content");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreatingNews, setIsCreatingNews] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "JBC NEWS - Staff Portal";
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
                  JBC <span className="text-secondary">STAFF</span>
                </h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "content" ? "bg-primary-light" : ""
              }`}
              onClick={() => {
                setActiveTab("content");
                setIsCreatingNews(false);
              }}
            >
              <FileText className="mr-2 h-5 w-5" />
              Content Management
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "editor" || isCreatingNews ? "bg-primary-light" : ""
              }`}
              onClick={() => {
                setActiveTab("editor");
                setIsCreatingNews(true);
              }}
            >
              <PenTool className="mr-2 h-5 w-5" />
              Create Article
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "support" ? "bg-primary-light" : ""
              }`}
              onClick={() => {
                setActiveTab("support");
                setIsCreatingNews(false);
              }}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Support
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === "settings" ? "bg-primary-light" : ""
              }`}
              onClick={() => {
                setActiveTab("settings");
                setIsCreatingNews(false);
              }}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>

          <div className="p-4 border-t border-primary-light">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <span className="font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase() || "S"}
                </span>
              </div>
              <div>
                <p className="font-medium">{user?.username || "Staff User"}</p>
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
          {activeTab === "content" && !isCreatingNews && (
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-serif font-bold">Staff Dashboard</h1>
              <Button 
                onClick={() => {
                  setActiveTab("editor");
                  setIsCreatingNews(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="content">
              {!isCreatingNews && <ContentManagement />}
            </TabsContent>
            <TabsContent value="editor">
              <NewsEditor />
            </TabsContent>
            <TabsContent value="support">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Support</h2>
                <p className="text-muted-foreground">Contact admin for assistance or submit support requests.</p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Settings</h2>
                <p className="text-muted-foreground">Manage your staff account settings.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
