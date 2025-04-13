import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Link } from "wouter";

type RegionalNewsItemProps = {
  news: News;
  category: string;
};

function RegionalNewsItem({ news, category }: RegionalNewsItemProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "politics":
        return "bg-primary";
      case "business":
      case "economy":
        return "bg-info";
      case "technology":
      case "infrastructure":
        return "bg-secondary";
      case "sports":
        return "bg-success";
      case "entertainment":
        return "bg-secondary-light";
      case "health":
        return "bg-success";
      case "science":
        return "bg-info";
      default:
        return "bg-primary";
    }
  };

  return (
    <Link href={`/news/${news.id}`}>
      <div className="news-card bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex items-start">
          <span
            className={`category-pill ${getCategoryColor(
              category
            )} text-white text-xs py-0.5 px-2 rounded-full mr-2 mt-1`}
          >
            {category}
          </span>
          <h4 className="font-medium">{news.title}</h4>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          {news.summary || news.content.substring(0, 100) + "..."}
        </p>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          {new Date(news.publishedAt || news.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          ago
        </div>
      </div>
    </Link>
  );
}

export default function RegionalNews() {
  const { data: indiaNews, isLoading: indiaLoading } = useQuery<News[]>({
    queryKey: ["/api/news/region/india"],
  });

  const { data: pakistanNews, isLoading: pakistanLoading } = useQuery<News[]>({
    queryKey: ["/api/news/region/pakistan"],
  });

  if (indiaLoading || pakistanLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Regional Focus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm"
                >
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm"
                >
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-serif font-bold mb-6">Regional Focus</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* India News */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif font-semibold flex items-center">
              <img
                src="https://flagcdn.com/w40/in.png"
                alt="India flag"
                className="w-8 h-auto mr-2"
              />
              India
            </h3>
            <Link href="/news/region/india">
              <a className="text-sm text-primary dark:text-secondary hover:underline">
                View All
              </a>
            </Link>
          </div>
          <div className="space-y-4">
            {indiaNews?.slice(0, 3).map((news) => (
              <RegionalNewsItem
                key={news.id}
                news={news}
                category={
                  news.category === "Business" ? "Economy" : news.category
                }
              />
            ))}
          </div>
        </div>

        {/* Pakistan News */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif font-semibold flex items-center">
              <img
                src="https://flagcdn.com/w40/pk.png"
                alt="Pakistan flag"
                className="w-8 h-auto mr-2"
              />
              Pakistan
            </h3>
            <Link href="/news/region/pakistan">
              <a className="text-sm text-primary dark:text-secondary hover:underline">
                View All
              </a>
            </Link>
          </div>
          <div className="space-y-4">
            {pakistanNews?.slice(0, 3).map((news) => (
              <RegionalNewsItem
                key={news.id}
                news={news}
                category={
                  news.category === "Business"
                    ? "Infrastructure"
                    : news.category
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
