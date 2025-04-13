import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  Loader2,
  MoreHorizontal,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
} from "lucide-react";
import NewsEditor from "./news-editor";

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "published" | "archived">("all");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [isViewingNews, setIsViewingNews] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<{ field: keyof News; direction: "asc" | "desc" }>({
    field: "updatedAt",
    direction: "desc",
  });

  const { toast } = useToast();

  // Fetch news
  const { data: newsItems = [], isLoading, refetch } = useQuery<News[]>({
    queryKey: ["/api/staff/news"],
  });

  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: async (newsId: number) => {
      await apiRequest("DELETE", `/api/staff/news/${newsId}`);
    },
    onSuccess: () => {
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/news"] });
      setIsDeleteDialogOpen(false);
      setSelectedNews(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter and sort news
  const filteredNews = newsItems
    .filter((news) => {
      // Filter by tab
      if (activeTab !== "all" && news.status !== activeTab) {
        return false;
      }
      
      // Filter by search
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        news.title.toLowerCase().includes(query) ||
        news.category.toLowerCase().includes(query) ||
        news.region?.toLowerCase().includes(query) ||
        news.summary?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];

      if (!aValue || !bValue) return 0;

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortBy.direction === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortBy.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  // Handle sorting
  const handleSort = (field: keyof News) => {
    setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === "asc" ? "desc" : "asc",
    });
  };

  // Handle edit news
  const handleEditNews = (news: News) => {
    setSelectedNews(news);
    setIsEditingNews(true);
  };

  // Handle view news
  const handleViewNews = (news: News) => {
    setSelectedNews(news);
    setIsViewingNews(true);
  };

  // Handle delete news
  const handleDeleteNews = (news: News) => {
    setSelectedNews(news);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete news
  const confirmDeleteNews = () => {
    if (selectedNews) {
      deleteNewsMutation.mutate(selectedNews.id);
    }
  };

  // Format date for display
  const formatDate = (date?: Date | string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">Content Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddingNews(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList>
          <TabsTrigger value="all">All Articles</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Region</TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("updatedAt")} className="cursor-pointer">
                  Last Updated
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-neutral-400 mb-2" />
                      <p className="text-neutral-500">No articles found</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery("");
                          setActiveTab("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {news.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {news.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{news.region || "Global"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          news.status === "published"
                            ? "success"
                            : news.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {news.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(news.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {news.isLive && (
                          <Badge variant="secondary" className="bg-secondary text-white">Live</Badge>
                        )}
                        {news.isPremium && (
                          <Badge variant="secondary" className="bg-accent text-neutral-800">Premium</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewNews(news)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditNews(news)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteNews(news)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add News Dialog */}
      <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Article</DialogTitle>
          </DialogHeader>
          <NewsEditor />
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog open={isEditingNews} onOpenChange={setIsEditingNews}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Article</DialogTitle>
          </DialogHeader>
          {selectedNews && <NewsEditor existingNews={selectedNews} />}
        </DialogContent>
      </Dialog>

      {/* View News Dialog */}
      <Dialog open={isViewingNews} onOpenChange={setIsViewingNews}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Article Preview</DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="mt-6 space-y-6">
              {/* Featured Image */}
              {selectedNews.imageUrl && (
                <div className="relative rounded-lg overflow-hidden h-64">
                  <img 
                    src={selectedNews.imageUrl} 
                    alt={selectedNews.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {selectedNews.isLive && (
                      <span className="bg-secondary text-white text-xs py-1 px-3 rounded-full flex items-center">
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        LIVE
                      </span>
                    )}
                    <span className="bg-primary text-white text-xs py-1 px-3 rounded-full">
                      {selectedNews.category}
                    </span>
                    {selectedNews.isPremium && (
                      <span className="bg-accent text-neutral-800 text-xs py-1 px-3 rounded-full">
                        PREMIUM
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Article Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold mb-3">{selectedNews.title}</h1>
                {selectedNews.summary && (
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                    {selectedNews.summary}
                  </p>
                )}
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                  <span>Author ID: {selectedNews.authorId} | </span>
                  {selectedNews.publishedAt ? (
                    <span>Published: {formatDate(selectedNews.publishedAt)} | </span>
                  ) : (
                    <span>Not published | </span>
                  )}
                  <span>Last updated: {formatDate(selectedNews.updatedAt)}</span>
                  {selectedNews.region && (
                    <span> | Region: {selectedNews.region}</span>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="prose dark:prose-invert max-w-none">
                {selectedNews.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-6">
                <div className="flex justify-between">
                  <div className="flex space-x-2 text-sm">
                    <span 
                      className={`px-2 py-1 rounded ${
                        selectedNews.status === "draft" 
                          ? "bg-neutral-200 dark:bg-neutral-800" 
                          : selectedNews.status === "published" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      Status: {selectedNews.status}
                    </span>
                  </div>
                  <Button variant="outline" onClick={() => handleEditNews(selectedNews)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete News Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedNews && (
              <>
                <p className="font-medium">{selectedNews.title}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {selectedNews.category} • {formatDate(selectedNews.updatedAt)}
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteNews}
              disabled={deleteNewsMutation.isPending}
            >
              {deleteNewsMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
