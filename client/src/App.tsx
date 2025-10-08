import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Auth pages
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

// Student pages
import StudentDashboard from "@/pages/student/dashboard";
import AIChat from "@/pages/student/chat";
import Assignments from "@/pages/student/assignments";
import Quizzes from "@/pages/student/quizzes";
import Flashcards from "@/pages/student/flashcards";
import Progress from "@/pages/student/progress";
import Leaderboard from "@/pages/student/leaderboard";

// Teacher pages
import TeacherDashboard from "@/pages/teacher/dashboard";

// Parent pages
import ParentDashboard from "@/pages/parent/dashboard";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Student routes */}
      <Route path="/" component={StudentDashboard} />
      <Route path="/chat" component={AIChat} />
      <Route path="/assignments" component={Assignments} />
      <Route path="/quizzes" component={Quizzes} />
      <Route path="/flashcards" component={Flashcards} />
      <Route path="/progress" component={Progress} />
      <Route path="/leaderboard" component={Leaderboard} />

      {/* Teacher routes */}
      <Route path="/teacher" component={TeacherDashboard} />

      {/* Parent routes */}
      <Route path="/parent" component={ParentDashboard} />

      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Router />;
  }

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar userRole={user.role as any} userName={user.name} userEmail={user.email} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover-elevate" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
