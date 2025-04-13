import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Subscription, User } from "@shared/schema";
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
import {
  ArrowUpDown,
  Loader2,
  MoreHorizontal,
  Search,
  RefreshCw,
  Ban,
  CheckCircle,
} from "lucide-react";

interface SubscriptionWithUser extends Subscription {
  user?: User;
}

export default function SubscriptionManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionWithUser | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<{ field: keyof SubscriptionWithUser; direction: "asc" | "desc" }>({
    field: "startDate",
    direction: "desc",
  });

  const { toast } = useToast();

  // Fetch subscriptions
  const { data: subscriptions = [], isLoading: isLoadingSubscriptions, refetch: refetchSubscriptions } = useQuery<Subscription[]>({
    queryKey: ["/api/admin/subscriptions"],
  });

  // Fetch users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Combine subscription data with user data
  const subscriptionsWithUsers: SubscriptionWithUser[] = subscriptions.map(subscription => {
    const user = users.find(u => u.id === subscription.userId);
    return { ...subscription, user };
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      const res = await apiRequest("PUT", `/api/admin/subscriptions/${subscriptionId}`, {
        status: "canceled"
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription canceled",
        description: "The subscription has been successfully canceled.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsCancelDialogOpen(false);
      setSelectedSubscription(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to cancel subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptionsWithUsers
    .filter((subscription) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        subscription.user?.username.toLowerCase().includes(query) ||
        subscription.user?.email.toLowerCase().includes(query) ||
        subscription.plan.toLowerCase().includes(query) ||
        subscription.status.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];

      if (!aValue || !bValue) return 0;

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortBy.direction === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortBy.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  // Handle sorting
  const handleSort = (field: keyof SubscriptionWithUser) => {
    setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === "asc" ? "desc" : "asc",
    });
  };

  // Handle cancel subscription
  const handleCancelSubscription = (subscription: SubscriptionWithUser) => {
    setSelectedSubscription(subscription);
    setIsCancelDialogOpen(true);
  };

  // Confirm cancel subscription
  const confirmCancelSubscription = () => {
    if (selectedSubscription) {
      cancelSubscriptionMutation.mutate(selectedSubscription.id);
    }
  };

  const isLoading = isLoadingSubscriptions || isLoadingUsers;

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">Subscription Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => refetchSubscriptions()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead onClick={() => handleSort("plan")} className="cursor-pointer">
                  Plan
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("startDate")} className="cursor-pointer">
                  Start Date
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("endDate")} className="cursor-pointer">
                  End Date
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="font-medium">{subscription.user?.username || "Unknown"}</div>
                      <div className="text-sm text-neutral-500">{subscription.user?.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {subscription.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{formatDate(subscription.startDate)}</TableCell>
                    <TableCell>{formatDate(subscription.endDate)}</TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">
                        {subscription.stripeSubscriptionId
                          ? subscription.stripeSubscriptionId.substring(0, 10) + "..."
                          : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {subscription.status === "active" && (
                            <DropdownMenuItem 
                              onClick={() => handleCancelSubscription(subscription)}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Cancel Subscription
                            </DropdownMenuItem>
                          )}
                          {subscription.status !== "active" && (
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Reactivate Subscription
                            </DropdownMenuItem>
                          )}
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

      {/* Cancel Subscription Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Subscription Cancellation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to cancel the subscription for{" "}
              <strong>{selectedSubscription?.user?.username}</strong>? This action will:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Cancel the recurring billing immediately</li>
              <li>User will retain premium access until the end date</li>
              <li>No refunds will be processed automatically</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={confirmCancelSubscription}
              disabled={cancelSubscriptionMutation.isPending}
            >
              {cancelSubscriptionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
