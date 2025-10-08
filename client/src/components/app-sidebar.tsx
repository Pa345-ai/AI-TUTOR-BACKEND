import { 
  GraduationCap, 
  MessageSquare, 
  FileText, 
  Brain, 
  BarChart3, 
  Trophy, 
  Settings, 
  BookOpen,
  Users,
  Bell,
  Home
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const studentItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "AI Tutor", url: "/chat", icon: MessageSquare },
  { title: "Assignments", url: "/assignments", icon: FileText },
  { title: "Quizzes", url: "/quizzes", icon: Brain },
  { title: "Flashcards", url: "/flashcards", icon: BookOpen },
  { title: "Progress", url: "/progress", icon: BarChart3 },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
];

const teacherItems = [
  { title: "Dashboard", url: "/teacher", icon: Home },
  { title: "Students", url: "/teacher/students", icon: Users },
  { title: "Assignments", url: "/teacher/assignments", icon: FileText },
  { title: "Quizzes", url: "/teacher/quizzes", icon: Brain },
  { title: "Analytics", url: "/teacher/analytics", icon: BarChart3 },
];

const parentItems = [
  { title: "Dashboard", url: "/parent", icon: Home },
  { title: "Children", url: "/parent/children", icon: Users },
  { title: "Progress", url: "/parent/progress", icon: BarChart3 },
  { title: "Notifications", url: "/parent/notifications", icon: Bell },
];

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

interface AppSidebarProps {
  userRole?: "student" | "teacher" | "parent" | "admin";
  userName?: string;
  userEmail?: string;
}

export function AppSidebar({ userRole = "student", userName = "User", userEmail }: AppSidebarProps) {
  const [location] = useLocation();
  
  const items = userRole === "teacher" ? teacherItems 
    : userRole === "parent" ? parentItems
    : userRole === "admin" ? adminItems 
    : studentItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">EduAI</h2>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userName}</p>
            {userEmail && <p className="text-xs text-muted-foreground truncate">{userEmail}</p>}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
