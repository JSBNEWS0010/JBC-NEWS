import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { telegramService } from "./telegram";
import { z } from "zod";
import Stripe from "stripe";
import { insertNewsSchema, insertSupportTicketSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes and middleware
  setupAuth(app);
  
  // Initialize Stripe if API key exists
  let stripe: Stripe | undefined;
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
  }

  // Get middleware from auth setup
  const { requireAdmin, requireStaff, requireUser } = app.locals;

  // Public routes
  
  // Get all published news
  app.get("/api/news", async (req, res) => {
    try {
      let news = await storage.getAllNews();
      
      // Filter out draft and archived news for public access
      news = news.filter(item => item.status === "published");
      
      // Get premium news IDs
      const premiumNewsIds = news
        .filter(item => item.isPremium)
        .map(item => item.id);
      
      // Check if user is premium
      const isPremium = req.isAuthenticated() && (req.user as any)?.isPremium;
      
      // For non-premium users, remove premium content
      if (!isPremium) {
        news = news.filter(item => !item.isPremium);
      }
      
      // Map to add premiumContent field but don't return actual content
      const result = news.map(item => ({
        ...item,
        isPremiumContent: premiumNewsIds.includes(item.id)
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  // Get news item by ID
  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsId = parseInt(req.params.id);
      if (isNaN(newsId)) {
        return res.status(400).json({ message: "Invalid news ID" });
      }
      
      const newsItem = await storage.getNews(newsId);
      if (!newsItem || newsItem.status !== "published") {
        return res.status(404).json({ message: "News not found" });
      }
      
      // Check if this is premium content and user has access
      if (newsItem.isPremium) {
        const isPremium = req.isAuthenticated() && (req.user as any)?.isPremium;
        if (!isPremium) {
          // Send partial content for non-premium users
          const { content, ...partialContent } = newsItem;
          return res.json({
            ...partialContent,
            isPremiumContent: true,
            content: "This is premium content. Subscribe to access the full article."
          });
        }
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news item" });
    }
  });

  // Get news by category
  app.get("/api/news/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      let news = await storage.getNewsByCategory(category);
      
      // Filter out draft and archived news
      news = news.filter(item => item.status === "published");
      
      // Handle premium content same as above
      const isPremium = req.isAuthenticated() && (req.user as any)?.isPremium;
      if (!isPremium) {
        news = news.filter(item => !item.isPremium);
      }
      
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news by category" });
    }
  });

  // Get news by region
  app.get("/api/news/region/:region", async (req, res) => {
    try {
      const region = req.params.region;
      let news = await storage.getNewsByRegion(region);
      
      // Filter out draft and archived news
      news = news.filter(item => item.status === "published");
      
      // Handle premium content
      const isPremium = req.isAuthenticated() && (req.user as any)?.isPremium;
      if (!isPremium) {
        news = news.filter(item => !item.isPremium);
      }
      
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news by region" });
    }
  });

  // Get live news
  app.get("/api/news/live", async (req, res) => {
    try {
      const news = await storage.getLiveNews();
      
      // Check if user is premium to handle premium content
      const isPremium = req.isAuthenticated() && (req.user as any)?.isPremium;
      
      // For non-premium users, filter out premium content
      const filteredNews = isPremium 
        ? news 
        : news.filter(item => !item.isPremium);
      
      res.json(filteredNews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching live news" });
    }
  });

  // Search news
  app.get("/api/news/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      let news = await storage.searchNews(query);
      
      // Handle premium content
      const isPremium = req.isAuthenticated() && (req.user as any)?.isPremium;
      if (!isPremium) {
        news = news.filter(item => !item.isPremium);
      }
      
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error searching news" });
    }
  });

  // User-specific routes (require login)
  
  // Create support ticket
  app.post("/api/support/tickets", requireUser, async (req, res) => {
    try {
      const user = req.user as any;
      const validationResult = insertSupportTicketSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.errors 
        });
      }
      
      const ticket = await storage.createSupportTicket({
        ...validationResult.data,
        userId: user.id
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Error creating support ticket" });
    }
  });

  // Get user's support tickets
  app.get("/api/support/tickets", requireUser, async (req, res) => {
    try {
      const user = req.user as any;
      const tickets = await storage.getSupportTicketsByUser(user.id);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching support tickets" });
    }
  });

  // Link Telegram ID to user account
  app.post("/api/user/link-telegram", requireUser, async (req, res) => {
    try {
      const user = req.user as any;
      const { telegramId } = req.body;
      
      if (!telegramId) {
        return res.status(400).json({ message: "Telegram ID is required" });
      }
      
      const existingUser = await storage.getUserByTelegramId(telegramId);
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: "This Telegram ID is already linked to another account" });
      }
      
      const updatedUser = await storage.updateUser(user.id, { telegramId });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const success = await telegramService.linkTelegramAccount(telegramId, user.id);
      if (!success) {
        return res.status(500).json({ message: "Failed to link Telegram account" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error linking Telegram ID" });
    }
  });

  // Get current user's subscription
  app.get("/api/user/subscription", requireUser, async (req, res) => {
    try {
      const user = req.user as any;
      const subscriptions = await storage.getSubscriptionsByUser(user.id);
      
      // Get the active subscription (if any)
      const activeSubscription = subscriptions.find(sub => sub.status === "active");
      
      res.json(activeSubscription || null);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subscription" });
    }
  });

  // Staff routes (require staff login)
  
  // Create or update news
  app.post("/api/staff/news", requireStaff, async (req, res) => {
    try {
      const user = req.user as any;
      const validationResult = insertNewsSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.errors 
        });
      }
      
      const news = await storage.createNews({
        ...validationResult.data,
        authorId: user.id
      });
      
      res.status(201).json(news);
    } catch (error) {
      res.status(500).json({ message: "Error creating news" });
    }
  });

  // Update news
  app.put("/api/staff/news/:id", requireStaff, async (req, res) => {
    try {
      const newsId = parseInt(req.params.id);
      if (isNaN(newsId)) {
        return res.status(400).json({ message: "Invalid news ID" });
      }
      
      const newsItem = await storage.getNews(newsId);
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }
      
      // Optional: Check if this staff member is the author or has permission
      
      const updates = req.body;
      const updatedNews = await storage.updateNews(newsId, updates);
      
      res.json(updatedNews);
    } catch (error) {
      res.status(500).json({ message: "Error updating news" });
    }
  });

  // Get all news for staff (including drafts)
  app.get("/api/staff/news", requireStaff, async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  // Delete news
  app.delete("/api/staff/news/:id", requireStaff, async (req, res) => {
    try {
      const newsId = parseInt(req.params.id);
      if (isNaN(newsId)) {
        return res.status(400).json({ message: "Invalid news ID" });
      }
      
      const success = await storage.deleteNews(newsId);
      if (!success) {
        return res.status(404).json({ message: "News not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting news" });
    }
  });

  // Admin routes (require admin login)
  
  // Get all users
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Create or update user
  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const { email, username, ...userData } = req.body;
      
      if (!email || !username) {
        return res.status(400).json({ message: "Email and username are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser({
        email,
        username,
        ...userData,
        password: userData.password || "defaultPassword123", // This would be a securely generated password in production
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Update user
  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updates = req.body;
      const updatedUser = await storage.updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  // Get all support tickets (admin view)
  app.get("/api/admin/support/tickets", requireAdmin, async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching support tickets" });
    }
  });

  // Update support ticket
  app.put("/api/admin/support/tickets/:id", requireAdmin, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }
      
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Support ticket not found" });
      }
      
      const updates = req.body;
      const updatedTicket = await storage.updateSupportTicket(ticketId, updates);
      
      res.json(updatedTicket);
    } catch (error) {
      res.status(500).json({ message: "Error updating support ticket" });
    }
  });

  // Get analytics
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const userStats = await storage.getUserStats();
      const newsStats = await storage.getNewsStats();
      
      res.json({
        users: userStats,
        news: newsStats
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });

  // Send Telegram broadcast
  app.post("/api/admin/telegram/broadcast", requireAdmin, async (req, res) => {
    try {
      const { message, country } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Broadcast message is required" });
      }
      
      const sentCount = await telegramService.sendBroadcast(message, country);
      
      res.json({ success: true, sentCount });
    } catch (error) {
      res.status(500).json({ message: "Error sending broadcast" });
    }
  });

  // Telegram Bot Webhook Endpoints
  // Main Bot - For registrations and user interaction
  app.post("/api/telegram/webhook/main", async (req, res) => {
    try {
      // In a real implementation, this would validate the request is from Telegram
      // and then process the update using the Telegram Bot API
      const update = req.body;
      console.log("Received update for Main bot:", JSON.stringify(update).substring(0, 100) + "...");
      
      // Process with the appropriate bot
      // Here we would handle user commands, registrations, etc.
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing Main bot webhook:", error);
      res.sendStatus(500);
    }
  });

  // News Bot - For sending news updates
  app.post("/api/telegram/webhook/news", async (req, res) => {
    try {
      const update = req.body;
      console.log("Received update for News bot:", JSON.stringify(update).substring(0, 100) + "...");
      
      // Process news-related commands
      // Here we would handle subscriptions to news categories, etc.
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing News bot webhook:", error);
      res.sendStatus(500);
    }
  });

  // Support Bot - For handling user support tickets
  app.post("/api/telegram/webhook/support", async (req, res) => {
    try {
      const update = req.body;
      console.log("Received update for Support bot:", JSON.stringify(update).substring(0, 100) + "...");
      
      // Process support tickets
      // Here we would create support tickets from user messages
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing Support bot webhook:", error);
      res.sendStatus(500);
    }
  });

  // Staff Bot - For internal staff communication
  app.post("/api/telegram/webhook/staff", async (req, res) => {
    try {
      const update = req.body;
      console.log("Received update for Staff bot:", JSON.stringify(update).substring(0, 100) + "...");
      
      // Process staff communications
      // Here we would handle staff commands and notifications
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing Staff bot webhook:", error);
      res.sendStatus(500);
    }
  });

  // Test Telegram Bot Integration
  app.get("/api/telegram/test", async (req, res) => {
    try {
      const results = {
        mainBot: !!telegramService.mainBotToken,
        newsBot: !!telegramService.newsBotToken,
        supportBot: !!telegramService.supportBotToken,
        staffBot: !!telegramService.staffBotToken
      };
      
      res.json({
        status: "Telegram integration active",
        botStatus: results
      });
    } catch (error) {
      res.status(500).json({ message: "Error testing Telegram integration" });
    }
  });

  // Stripe subscription routes (if Stripe is configured)
  if (stripe) {
    // Create Stripe checkout session for subscription
    app.post("/api/create-subscription", requireUser, async (req, res) => {
      try {
        const user = req.user as any;
        const { priceId } = req.body;
        
        if (!priceId) {
          return res.status(400).json({ message: "Price ID is required" });
        }
        
        // Create or get Stripe customer
        let customerId = user.stripeCustomerId;
        
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.username,
            metadata: {
              userId: user.id.toString()
            }
          });
          
          customerId = customer.id;
          await storage.updateUserStripeInfo(user.id, { customerId });
        }
        
        // Create subscription checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/subscription/canceled`,
        });
        
        res.json({ url: session.url });
      } catch (error) {
        res.status(500).json({ message: "Error creating subscription" });
      }
    });

    // Webhook for subscription status updates
    app.post("/api/webhook", async (req, res) => {
      try {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
          return res.status(500).json({ message: "Webhook secret not configured" });
        }
        
        const sig = req.headers['stripe-signature'] as string;
        let event;
        
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
          return res.status(400).json({ message: `Webhook Error: ${err.message}` });
        }
        
        // Handle the event
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            
            // Find user by Stripe customer ID
            const users = await storage.getAllUsers();
            const user = users.find(u => u.stripeCustomerId === customerId);
            
            if (user) {
              // Update user's subscription info
              await storage.updateUserStripeInfo(user.id, { 
                customerId, 
                subscriptionId: subscription.id 
              });
              
              // Create or update subscription record
              const existingSubscriptions = await storage.getSubscriptionsByUser(user.id);
              const existingSubscription = existingSubscriptions.find(
                s => s.stripeSubscriptionId === subscription.id
              );
              
              if (existingSubscription) {
                await storage.updateSubscription(existingSubscription.id, {
                  status: subscription.status as any,
                  endDate: new Date(subscription.current_period_end * 1000)
                });
              } else {
                await storage.createSubscription({
                  userId: user.id,
                  plan: (subscription.items.data[0].price.nickname || "monthly") as any,
                  status: subscription.status as any,
                  startDate: new Date(subscription.current_period_start * 1000),
                  endDate: new Date(subscription.current_period_end * 1000),
                  stripeSubscriptionId: subscription.id
                });
              }
            }
            break;
          }
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            
            // Find user by Stripe customer ID
            const users = await storage.getAllUsers();
            const user = users.find(u => u.stripeCustomerId === customerId);
            
            if (user) {
              // Update user's premium status
              await storage.updateUser(user.id, { isPremium: false });
              
              // Update subscription record
              const existingSubscriptions = await storage.getSubscriptionsByUser(user.id);
              const existingSubscription = existingSubscriptions.find(
                s => s.stripeSubscriptionId === subscription.id
              );
              
              if (existingSubscription) {
                await storage.updateSubscription(existingSubscription.id, {
                  status: "canceled"
                });
              }
            }
            break;
          }
        }
        
        res.sendStatus(200);
      } catch (error) {
        res.status(500).json({ message: "Error processing webhook" });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
