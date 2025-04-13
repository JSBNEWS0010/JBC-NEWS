import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import NewsCard from "./news-card";

const categories = [
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
];

export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("Politics");

  const { data: newsItems, isLoading } = useQuery<News[]>({
    queryKey: [`/api/news/category/${activeCategory.toLowerCase()}`],
  });

  const handleTabChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="mb-12">
      <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
        <ul className="flex flex-wrap -mb-px" id="categoryTabs">
          {categories.map((category) => (
            <li key={category} className="mr-2">
              <button
                className={`login-tab inline-block p-4 border-b-2 font-medium ${
                  activeCategory === category
                    ? "border-primary text-primary dark:text-white dark:border-white"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                }`}
                onClick={() => handleTabChange(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab content */}
      <div className="category-content">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-neutral-200 dark:bg-neutral-700 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !newsItems || newsItems.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-neutral-500 dark:text-neutral-400">
              No {activeCategory} news available at the moment
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.slice(0, 4).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
