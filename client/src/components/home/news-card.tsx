import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { News } from "@shared/schema";
import { Share, Bookmark } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NewsCardProps {
  news: News;
  isLive?: boolean;
  isFeatured?: boolean;
  isSidebar?: boolean;
}

export default function NewsCard({
  news,
  isLive = false,
  isFeatured = false,
  isSidebar = false,
}: NewsCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "politics":
        return "bg-primary";
      case "business":
        return "bg-info";
      case "technology":
        return "bg-primary-light";
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

  const getTimeAgo = (date: Date | string | undefined) => {
    if (!date) return "Recently";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        url: `/news/${news.id}`
      });
    } else {
      // Fallback if Web Share API is not available
      navigator.clipboard.writeText(window.location.origin + `/news/${news.id}`);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with others",
      });
    }
  };
  
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked 
        ? "The article has been removed from your bookmarks" 
        : "The article has been saved to your bookmarks",
    });
  };

  if (isSidebar) {
    return (
      <Link href={`/news/${news.id}`}>
        <div className="news-card bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden flex cursor-pointer hover:shadow-md transition-shadow">
          <img
            src={news.imageUrl || "https://images.unsplash.com/photo-1560195183-a0ac26b23bab?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"}
            className="w-32 h-full object-cover"
            alt={news.title}
          />
          <div className="p-3 flex-1">
            <div className="flex items-center mb-1">
              <span className={`category-pill ${getCategoryColor(news.category)} text-white text-xs py-0.5 px-2 rounded-full`}>
                {news.category}
              </span>
            </div>
            <h3 className="font-serif font-bold text-sm">{news.title}</h3>
            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{getTimeAgo(news.publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (isFeatured) {
    return (
      <Link href={`/news/${news.id}`}>
        <div className="news-card lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={news.imageUrl || "https://images.unsplash.com/photo-1601933513793-45585288fdb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"}
              className="w-full h-80 object-cover"
              alt={news.title}
            />
            <div className="absolute top-3 left-3 flex space-x-2">
              <span className={`category-pill ${getCategoryColor(news.category)} text-white text-xs py-1 px-3 rounded-full`}>
                {news.category}
              </span>
              {news.isPremium && (
                <span className="bg-accent text-neutral-800 text-xs py-1 px-3 rounded-full">
                  PREMIUM
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-serif font-bold text-2xl mb-3">{news.title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {news.summary || news.content.substring(0, 150) + "..."}
            </p>
            <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
              <span>{getTimeAgo(news.publishedAt)}</span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare();
                  }}
                  className="hover:text-primary dark:hover:text-secondary flex items-center"
                >
                  <Share className="h-4 w-4 mr-1" /> Share
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleBookmark();
                  }}
                  className={`hover:text-primary dark:hover:text-secondary flex items-center ${bookmarked ? 'text-primary dark:text-secondary' : ''}`}
                >
                  <Bookmark className="h-4 w-4 mr-1" fill={bookmarked ? "currentColor" : "none"} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.id}`}>
      <div className="news-card bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={news.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
            className="w-full h-48 object-cover"
            alt={news.title}
          />
          <div className="absolute top-3 left-3 flex space-x-2">
            {isLive && (
              <span className="bg-secondary text-white text-xs py-1 px-3 rounded-full flex items-center">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </span>
            )}
            <span className={`category-pill ${getCategoryColor(news.category)} text-white text-xs py-1 px-3 rounded-full`}>
              {news.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif font-bold text-lg mb-2">{news.title}</h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
            {news.summary || news.content.substring(0, 100) + "..."}
          </p>
          <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
            <span>{getTimeAgo(news.publishedAt)}</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleShare();
                }}
                className="hover:text-primary dark:hover:text-secondary"
              >
                <Share className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleBookmark();
                }}
                className={`hover:text-primary dark:hover:text-secondary ${bookmarked ? 'text-primary dark:text-secondary' : ''}`}
              >
                <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
