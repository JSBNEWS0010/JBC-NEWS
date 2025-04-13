import {
  users,
  news,
  subscriptions,
  supportTickets,
  type User,
  type News,
  type Subscription,
  type SupportTicket,
  type InsertUser,
  type InsertNews,
  type InsertSubscription,
  type InsertSupportTicket,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // News operations
  getNews(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<News>): Promise<News | undefined>;
  deleteNews(id: number): Promise<boolean>;
  getAllNews(): Promise<News[]>;
  getNewsByCategory(category: string): Promise<News[]>;
  getNewsByRegion(region: string): Promise<News[]>;
  getLiveNews(): Promise<News[]>;
  getPremiumNews(): Promise<News[]>;
  searchNews(query: string): Promise<News[]>;
  
  // Subscription operations
  getSubscription(id: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<Subscription>): Promise<Subscription | undefined>;
  getSubscriptionsByUser(userId: number): Promise<Subscription[]>;
  
  // Support ticket operations
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, ticket: Partial<SupportTicket>): Promise<SupportTicket | undefined>;
  getSupportTicketsByUser(userId: number): Promise<SupportTicket[]>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  
  // Analytics
  getUserStats(): Promise<{ total: number; premium: number; byCountry: Record<string, number>; byLanguage: Record<string, number> }>;
  getNewsStats(): Promise<{ total: number; byCategory: Record<string, number>; byRegion: Record<string, number> }>;
  
  // Stripe integration
  updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId?: string }): Promise<User | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private news: Map<number, News>;
  private subscriptions: Map<number, Subscription>;
  private supportTickets: Map<number, SupportTicket>;
  currentUserId: number;
  currentNewsId: number;
  currentSubscriptionId: number;
  currentTicketId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.news = new Map();
    this.subscriptions = new Map();
    this.supportTickets = new Map();
    this.currentUserId = 1;
    this.currentNewsId = 1;
    this.currentSubscriptionId = 1;
    this.currentTicketId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Create default admin user
    this.createUser({
      username: "admin",
      email: "ayyan@jbc.com.pk",
      password: "9045CcF2",
      userType: "admin",
      country: "Pakistan",
      city: "Karachi",
      language: "english",
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // News operations
  async getNews(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const now = new Date();
    const news: News = { 
      ...insertNews, 
      id, 
      createdAt: now, 
      updatedAt: now,
      publishedAt: insertNews.status === "published" ? now : undefined
    };
    this.news.set(id, news);
    return news;
  }

  async updateNews(id: number, updates: Partial<News>): Promise<News | undefined> {
    const newsItem = this.news.get(id);
    if (!newsItem) return undefined;
    
    // If status is changing to published, set publishedAt
    if (updates.status === "published" && newsItem.status !== "published") {
      updates.publishedAt = new Date();
    }
    
    const updatedNews = { 
      ...newsItem, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: number): Promise<boolean> {
    return this.news.delete(id);
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values());
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    return Array.from(this.news.values()).filter(
      (news) => news.category.toLowerCase() === category.toLowerCase(),
    );
  }

  async getNewsByRegion(region: string): Promise<News[]> {
    return Array.from(this.news.values()).filter(
      (news) => news.region?.toLowerCase() === region.toLowerCase(),
    );
  }

  async getLiveNews(): Promise<News[]> {
    return Array.from(this.news.values()).filter(
      (news) => news.isLive === true && news.status === "published",
    );
  }

  async getPremiumNews(): Promise<News[]> {
    return Array.from(this.news.values()).filter(
      (news) => news.isPremium === true && news.status === "published",
    );
  }

  async searchNews(query: string): Promise<News[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.news.values()).filter(
      (news) => 
        (news.title.toLowerCase().includes(lowercaseQuery) ||
        news.content.toLowerCase().includes(lowercaseQuery) ||
        news.summary?.toLowerCase().includes(lowercaseQuery)) &&
        news.status === "published"
    );
  }

  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const subscription: Subscription = { ...insertSubscription, id, createdAt: new Date() };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: number, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...updates };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async getSubscriptionsByUser(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.userId === userId,
    );
  }

  // Support ticket operations
  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    return this.supportTickets.get(id);
  }

  async createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const id = this.currentTicketId++;
    const now = new Date();
    const ticket: SupportTicket = { ...insertTicket, id, createdAt: now, updatedAt: now };
    this.supportTickets.set(id, ticket);
    return ticket;
  }

  async updateSupportTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    const ticket = this.supportTickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { ...ticket, ...updates, updatedAt: new Date() };
    this.supportTickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async getSupportTicketsByUser(userId: number): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values()).filter(
      (ticket) => ticket.userId === userId,
    );
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values());
  }

  // Analytics
  async getUserStats(): Promise<{ 
    total: number; 
    premium: number; 
    byCountry: Record<string, number>; 
    byLanguage: Record<string, number> 
  }> {
    const allUsers = Array.from(this.users.values());
    const premium = allUsers.filter(user => user.isPremium).length;
    
    const byCountry: Record<string, number> = {};
    const byLanguage: Record<string, number> = {};
    
    allUsers.forEach(user => {
      if (user.country) {
        byCountry[user.country] = (byCountry[user.country] || 0) + 1;
      }
      
      if (user.language) {
        byLanguage[user.language] = (byLanguage[user.language] || 0) + 1;
      }
    });
    
    return {
      total: allUsers.length,
      premium,
      byCountry,
      byLanguage
    };
  }

  async getNewsStats(): Promise<{ 
    total: number; 
    byCategory: Record<string, number>; 
    byRegion: Record<string, number> 
  }> {
    const allNews = Array.from(this.news.values());
    
    const byCategory: Record<string, number> = {};
    const byRegion: Record<string, number> = {};
    
    allNews.forEach(news => {
      byCategory[news.category] = (byCategory[news.category] || 0) + 1;
      
      if (news.region) {
        byRegion[news.region] = (byRegion[news.region] || 0) + 1;
      }
    });
    
    return {
      total: allNews.length,
      byCategory,
      byRegion
    };
  }

  // Stripe integration
  async updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId?: string }): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updates: Partial<User> = {
      stripeCustomerId: stripeInfo.customerId
    };
    
    if (stripeInfo.subscriptionId) {
      updates.stripeSubscriptionId = stripeInfo.subscriptionId;
      updates.isPremium = true;
    }
    
    return this.updateUser(userId, updates);
  }
}

export const storage = new MemStorage();
