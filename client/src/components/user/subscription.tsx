import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Subscription as SubscriptionType } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check, AlertCircle } from "lucide-react";

export default function Subscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch the user's active subscription
  const { data: subscription, isLoading } = useQuery<SubscriptionType>({
    queryKey: ["/api/user/subscription"],
  });

  // Create subscription checkout session
  const createCheckoutSession = useMutation({
    mutationFn: async (priceId: string) => {
      const res = await apiRequest("POST", "/api/create-subscription", {
        priceId,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const res = await apiRequest("POST", "/api/cancel-subscription", {
        subscriptionId,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    setIsProcessing(true);
    // Price IDs would be set in the backend
    const priceId = plan === "monthly" ? "price_monthly" : "price_yearly";
    createCheckoutSession.mutate(priceId);
  };

  const handleCancelSubscription = () => {
    if (subscription?.stripeSubscriptionId) {
      cancelSubscription.mutate(subscription.stripeSubscriptionId);
    }
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Subscription</h2>
        {subscription && (
          <Badge
            variant={
              subscription.status === "active"
                ? "success"
                : subscription.status === "canceled"
                ? "destructive"
                : "secondary"
            }
            className="capitalize"
          >
            {subscription.status}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : subscription ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your premium subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Plan
                </h3>
                <p className="capitalize">{subscription.plan}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Status
                </h3>
                <p className="capitalize">{subscription.status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Start Date
                </h3>
                <p>{formatDate(subscription.startDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  End Date
                </h3>
                <p>{formatDate(subscription.endDate)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Premium Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Ad-free experience across web and Telegram</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Exclusive in-depth analysis and special reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Breaking news alerts before general public</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Direct access to journalists via members-only events</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {subscription.status === "active" && (
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={cancelSubscription.isPending}
              >
                {cancelSubscription.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly</CardTitle>
              <CardDescription>Best for monthly flexibility</CardDescription>
              <div className="mt-2 text-3xl font-bold">
                $9.99 <span className="text-sm font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Ad-free experience</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Premium content access</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Early breaking news alerts</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe("monthly")}
                disabled={isProcessing}
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Subscribe Monthly
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card className="border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Yearly</CardTitle>
                  <CardDescription>Best value, save 20%</CardDescription>
                </div>
                <Badge>BEST VALUE</Badge>
              </div>
              <div className="mt-2 text-3xl font-bold">
                $95.88 <span className="text-sm font-normal">/year</span>
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                $7.99/month, billed annually
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>
                    <strong>All monthly benefits</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>
                    <strong>20% discount</strong> compared to monthly
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Exclusive yearly subscriber events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5" />
                  <span>Priority customer support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe("yearly")}
                disabled={isProcessing}
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Subscribe Yearly
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Telegram Integration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Telegram Integration</CardTitle>
          <CardDescription>
            Connect your JBC News subscription with Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <AlertCircle className="h-6 w-6 mr-3 text-blue-500" />
            <div>
              <h4 className="font-medium">Get Premium News on Telegram</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Link your Telegram account to receive premium content and breaking news directly in your Telegram app.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h4 className="font-medium">Telegram ID</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {user?.telegramId || "No Telegram ID connected"}
              </p>
            </div>
            <Button className="sm:self-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M21.5 7.5 2.9 16.7l3.8.9 2.2 4.7L12 14l9.5-6.5Z" />
                <path d="M10 14 2.9 16.7" />
              </svg>
              Connect Telegram
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
