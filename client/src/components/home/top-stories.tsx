import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import NewsCard from "./news-card";

export default function TopStories() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Top Stories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Story Skeleton */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-80 bg-neutral-200 dark:bg-neutral-700 rounded-t-lg"></div>
            <div className="p-6 space-y-3">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
            </div>
          </div>
          
          {/* Sidebar Stories Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden flex animate-pulse"
              >
                <div className="w-32 bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="p-3 flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return null;
  }

  // Get featured story and sidebar stories
  const sortedNews = [...news].sort(
    (a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
  );
  
  const featuredStory = sortedNews[0];
  const sidebarStories = sortedNews.slice(1, 5);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-serif font-bold mb-6">Top Stories</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Story */}
        {featuredStory && <NewsCard news={featuredStory} isFeatured={true} />}

        {/* Sidebar Stories */}
        <div className="space-y-4">
          {sidebarStories.map((story) => (
            <NewsCard key={story.id} news={story} isSidebar={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
