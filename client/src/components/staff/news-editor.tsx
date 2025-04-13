import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { News, insertNewsSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Eye, Image, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// News schema with extended validation
const newsSchema = insertNewsSchema.extend({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  summary: z.string().min(10, {
    message: "Summary must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  region: z.string().optional(),
  imageUrl: z.string().optional(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

const categories = [
  "Politics", 
  "Entertainment", 
  "Sports", 
  "Business", 
  "Technology", 
  "Health", 
  "Science", 
  "Alerts"
];

const regions = ["Global", "India", "Pakistan", "United States", "Europe", "Middle East", "Asia"];

export default function NewsEditor({ existingNews }: { existingNews?: News }) {
  const [previewMode, setPreviewMode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize form with existing news values or defaults
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: existingNews?.title || "",
      content: existingNews?.content || "",
      summary: existingNews?.summary || "",
      category: existingNews?.category || "Politics",
      region: existingNews?.region || "",
      imageUrl: existingNews?.imageUrl || "",
      isLive: existingNews?.isLive || false,
      isPremium: existingNews?.isPremium || false,
      status: existingNews?.status || "draft",
      authorId: user?.id || 0,
    },
  });

  // Create news mutation
  const createNewsMutation = useMutation({
    mutationFn: async (data: NewsFormValues) => {
      const res = await apiRequest("POST", "/api/staff/news", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "News created",
        description: "The article has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/news"] });
      form.reset(); // Reset form after successful creation
    },
    onError: (error) => {
      toast({
        title: "Failed to create news",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: NewsFormValues }) => {
      const res = await apiRequest("PUT", `/api/staff/news/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "News updated",
        description: "The article has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/news"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update news",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: NewsFormValues) => {
    if (existingNews) {
      updateNewsMutation.mutate({ id: existingNews.id, data });
    } else {
      createNewsMutation.mutate(data);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const isPending = createNewsMutation.isPending || updateNewsMutation.isPending;

  const formattedDate = (date?: Date | string) => {
    if (!date) return "Not published";
    return new Date(date).toLocaleString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">
            {existingNews ? "Edit Article" : "Create New Article"}
          </h2>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={togglePreview}
              type="button"
            >
              {previewMode ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Edit Mode
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {existingNews ? "Update" : "Publish"}
            </Button>
          </div>
        </div>

        {previewMode ? (
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden h-64 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              {form.watch("imageUrl") ? (
                <img 
                  src={form.watch("imageUrl")} 
                  alt={form.watch("title")} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-neutral-400">
                  <Image className="h-12 w-12 mb-2" />
                  <span>No image provided</span>
                </div>
              )}
              <div className="absolute top-3 left-3 flex space-x-2">
                {form.watch("isLive") && (
                  <span className="bg-secondary text-white text-xs py-1 px-3 rounded-full flex items-center">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE
                  </span>
                )}
                <span className="bg-primary text-white text-xs py-1 px-3 rounded-full">
                  {form.watch("category")}
                </span>
                {form.watch("isPremium") && (
                  <span className="bg-accent text-neutral-800 text-xs py-1 px-3 rounded-full">
                    PREMIUM
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold mb-3">{form.watch("title")}</h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                {form.watch("summary")}
              </p>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                <span>By {user?.username || "Staff"} | </span>
                <span>{formattedDate(existingNews?.publishedAt)}</span>
                {form.watch("region") && (
                  <span> | Region: {form.watch("region")}</span>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {form.watch("content").split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-6">
              <div className="flex space-x-2 text-sm">
                <span 
                  className={`px-2 py-1 rounded ${
                    form.watch("status") === "draft" 
                      ? "bg-neutral-200 dark:bg-neutral-800" 
                      : form.watch("status") === "published" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  Status: {form.watch("status")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Basic Information */}
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a compelling title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write a brief summary of the article" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This summary will appear in article previews and search results.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                              {...field}
                            >
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <FormControl>
                            <select
                              className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Select a region (optional)</option>
                              {regions.map((region) => (
                                <option key={region} value={region}>
                                  {region}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL for the article's featured image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Article Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your article content here..."
                            className="min-h-[500px] font-medium"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Use clear paragraphs separated by line breaks. You can use simple formatting.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publication Status</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                                {...field}
                              >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                              </select>
                            </FormControl>
                            <FormDescription>
                              Draft: Not visible to readers<br />
                              Published: Visible to all<br />
                              Archived: No longer displayed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="isLive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Mark as Live Coverage</FormLabel>
                              <FormDescription>
                                Highlight this article as live breaking news.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isPremium"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Premium Content</FormLabel>
                              <FormDescription>
                                Make this article available only to premium subscribers.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
