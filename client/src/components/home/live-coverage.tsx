import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import NewsCard from "./news-card";
import { Button } from "@/components/ui/button";

export default function LiveCoverage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  const { data: liveNews, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news/live"],
  });

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold">Live Coverage</h2>
          <div className="flex space-x-3">
            <Button variant="default" size="sm" className="rounded-full">
              All
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              India
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              Pakistan
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((skeleton) => (
            <div
              key={skeleton}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-md h-[350px] animate-pulse"
            >
              <div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!liveNews || liveNews.length === 0) {
    return null;
  }

  const filteredNews = selectedRegion === "all"
    ? liveNews
    : liveNews.filter((news) => news.region?.toLowerCase() === selectedRegion.toLowerCase());

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-serif font-bold">Live Coverage</h2>
        <div className="flex space-x-3">
          <Button
            variant={selectedRegion === "all" ? "default" : "ghost"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedRegion("all")}
          >
            All
          </Button>
          <Button
            variant={selectedRegion === "india" ? "default" : "ghost"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedRegion("india")}
          >
            India
          </Button>
          <Button
            variant={selectedRegion === "pakistan" ? "default" : "ghost"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedRegion("pakistan")}
          >
            Pakistan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} isLive={true} />
        ))}
      </div>
    </div>
  );
}
