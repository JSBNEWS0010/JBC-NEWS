import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useNewsById } from "@/hooks/use-news";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Share, Bookmark, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewsDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: news, isLoading, error } = useNewsById(id);

  useEffect(() => {
    if (news) {
      document.title = `JBC NEWS - ${news.title}`;
    } else {
      document.title = "JBC NEWS - Article";
    }
  }, [news]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title || "JBC NEWS Article",
        url: window.location.href,
      });
    } else {
      // Fallback if Web Share API is not available
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with others",
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Article bookmarked",
      description: "This article has been added to your bookmarks",
    });
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "Recently";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  const isPremiumContent = news?.isPremium && !user?.isPremium;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Article</h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  There was a problem loading this article. Please try again later.
                </p>
                <Link href="/">
                  <Button className="mt-4">Return to Home</Button>
                </Link>
              </div>
            ) : news ? (
              <article>
                <div className="mb-6">
                  <div className="flex space-x-2 mb-3">
                    <Badge className="bg-primary text-white">
                      {news.category}
                    </Badge>
                    {news.region && (
                      <Badge variant="outline">
                        {news.region}
                      </Badge>
                    )}
                    {news.isLive && (
                      <Badge className="bg-secondary text-white flex items-center">
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        LIVE
                      </Badge>
                    )}
                    {news.isPremium && (
                      <Badge className="bg-accent text-neutral-800">
                        PREMIUM
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                    {news.title}
                  </h1>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                    {news.summary}
                  </p>
                  <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                    <div>
                      <span>By Author #{news.authorId} • </span>
                      <span>{formatDate(news.publishedAt || news.createdAt)}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleShare}
                        className="flex items-center hover:text-primary dark:hover:text-secondary"
                      >
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </button>
                      <button
                        onClick={handleBookmark}
                        className="flex items-center hover:text-primary dark:hover:text-secondary"
                      >
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {news.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                )}

                {isPremiumContent ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded-lg text-center my-8">
                      <Lock className="h-12 w-12 mx-auto mb-4 text-primary dark:text-secondary" />
                      <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                      <p className="mb-4">
                        This is premium content available exclusively to premium subscribers.
                      </p>
                      <Link href="/user/subscription">
                        <Button className="bg-primary hover:bg-primary-dark">
                          Subscribe Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    {news.content.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </article>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  The article you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/">
                  <Button className="mt-4">Return to Home</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
