import { useQuery, useMutation } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useAllNews() {
  return useQuery<News[]>({
    queryKey: ["/api/news"],
  });
}

export function useNewsById(id?: string | number) {
  return useQuery<News>({
    queryKey: [`/api/news/${id}`],
    enabled: !!id,
  });
}

export function useNewsByCategory(category: string) {
  return useQuery<News[]>({
    queryKey: [`/api/news/category/${category.toLowerCase()}`],
    enabled: !!category,
  });
}

export function useNewsByRegion(region: string) {
  return useQuery<News[]>({
    queryKey: [`/api/news/region/${region.toLowerCase()}`],
    enabled: !!region,
  });
}

export function useLiveNews() {
  return useQuery<News[]>({
    queryKey: ["/api/news/live"],
  });
}

export function usePremiumNews() {
  return useQuery<News[]>({
    queryKey: ["/api/news/premium"],
  });
}

export function useSearchNews(query: string) {
  return useQuery<News[]>({
    queryKey: [`/api/news/search?q=${query}`],
    enabled: query.length > 2,
  });
}

export function useStaffNews() {
  return useQuery<News[]>({
    queryKey: ["/api/staff/news"],
  });
}

export function useNewsOperations() {
  const { toast } = useToast();

  const createNewsMutation = useMutation({
    mutationFn: async (newsData: Partial<News>) => {
      const res = await apiRequest("POST", "/api/staff/news", newsData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "News created",
        description: "The article has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create news",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<News> }) => {
      const res = await apiRequest("PUT", `/api/staff/news/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "News updated",
        description: "The article has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update news",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (newsId: number) => {
      await apiRequest("DELETE", `/api/staff/news/${newsId}`);
    },
    onSuccess: () => {
      toast({
        title: "News deleted",
        description: "The article has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete news",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
  };
}
