import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// User Login Form
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  rememberMe: z.boolean().optional(),
});

// User Registration Form
const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  language: z.string().min(1, { message: "Language is required" }),
  telegramId: z.string().optional(),
});

// Staff Login Form
const staffLoginSchema = z.object({
  staffId: z.string().min(1, { message: "Staff ID is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Admin Login Form
const adminLoginSchema = z.object({
  adminId: z.string().min(1, { message: "Admin ID is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  securityKey: z.string().min(1, { message: "Security key is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type StaffLoginFormValues = z.infer<typeof staffLoginSchema>;
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const countries = ["India", "Pakistan", "United States", "United Kingdom", "Other"];
const cities = ["Mumbai", "Delhi", "Karachi", "Lahore", "New York", "London", "Other"];
const languages = ["english", "hindi", "urdu"];

export default function AuthForm() {
  const [authTab, setAuthTab] = useState("userLogin");
  const { loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  // User Login Form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // User Registration Form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      country: "",
      city: "",
      language: "english",
      telegramId: "",
    },
  });

  // Staff Login Form
  const staffLoginForm = useForm<StaffLoginFormValues>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: {
      staffId: "",
      password: "",
    },
  });

  // Admin Login Form
  const adminLoginForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      adminId: "",
      password: "",
      securityKey: "",
    },
  });

  // Handle User Login
  const onUserLogin = (data: LoginFormValues) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (user) => {
          // Redirect based on user type
          if (user.userType === "admin") {
            setLocation("/admin");
          } else if (user.userType === "staff") {
            setLocation("/staff");
          } else {
            setLocation("/user");
          }
        },
      }
    );
  };

  // Handle User Registration
  const onUserRegister = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/user");
      },
    });
  };

  // Handle Staff Login
  const onStaffLogin = (data: StaffLoginFormValues) => {
    // Use special staff login endpoint
    loginMutation.mutate(
      { email: data.staffId, password: data.password },
      {
        onSuccess: () => {
          setLocation("/staff");
        },
      }
    );
  };

  // Handle Admin Login
  const onAdminLogin = (data: AdminLoginFormValues) => {
    // Use special admin login endpoint
    loginMutation.mutate(
      { 
        email: data.adminId, 
        password: data.password,
        securityKey: data.securityKey
      },
      {
        onSuccess: () => {
          setLocation("/admin");
        },
      }
    );
  };

  return (
    <Tabs defaultValue="userLogin" value={authTab} onValueChange={setAuthTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="userLogin" className="font-medium">User</TabsTrigger>
        <TabsTrigger value="staffLogin" className="font-medium">Staff</TabsTrigger>
        <TabsTrigger value="adminLogin" className="font-medium">Admin</TabsTrigger>
      </TabsList>

      {/* User Login/Register Tab */}
      <TabsContent value="userLogin" className="space-y-4">
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* User Login Form */}
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onUserLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm cursor-pointer">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />
                  <a href="#" className="text-sm text-primary dark:text-secondary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign In
                </Button>
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <span className="text-neutral-500 dark:text-neutral-400">Or connect with</span>
                  <a href="#" className="text-primary dark:text-secondary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M21.5 7.5 2.9 16.7l3.8.9 2.2 4.7L12 14l9.5-6.5Z" />
                      <path d="M10 14 2.9 16.7" />
                    </svg>
                  </a>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* User Registration Form */}
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onUserRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                            {...field}
                          >
                            <option value="">Select country</option>
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                            {...field}
                          >
                            <option value="">Select city</option>
                            {cities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={registerForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                          {...field}
                        >
                          <option value="english">English</option>
                          <option value="hindi">हिन्दी (Hindi)</option>
                          <option value="urdu">اردو (Urdu)</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="telegramId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="@yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Register
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* Staff Login Tab */}
      <TabsContent value="staffLogin">
        <div className="mb-4">
          <h2 className="text-2xl font-serif font-bold mb-2 text-primary dark:text-white">Staff Access</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">Login with your staff credentials to access the content management system.</p>
        </div>
        <Form {...staffLoginForm}>
          <form onSubmit={staffLoginForm.handleSubmit(onStaffLogin)} className="space-y-4">
            <FormField
              control={staffLoginForm.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your staff ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={staffLoginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign In as Staff
            </Button>
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-primary dark:text-secondary hover:underline">
                Having trouble logging in?
              </a>
            </div>
          </form>
        </Form>
      </TabsContent>

      {/* Admin Login Tab */}
      <TabsContent value="adminLogin">
        <div className="mb-4">
          <h2 className="text-2xl font-serif font-bold mb-2 text-primary dark:text-white">Admin Portal</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">Login with your admin credentials to access the system dashboard.</p>
        </div>
        <Form {...adminLoginForm}>
          <form onSubmit={adminLoginForm.handleSubmit(onAdminLogin)} className="space-y-4">
            <FormField
              control={adminLoginForm.control}
              name="adminId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your admin ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={adminLoginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={adminLoginForm.control}
              name="securityKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter security key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Secure Login
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
