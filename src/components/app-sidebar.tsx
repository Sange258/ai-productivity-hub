import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Brain,
  ClipboardList,
  LayoutDashboard,
  Mail,
  MessageSquare,
  NotebookPen,
  Search,
  Sparkles,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Smart Email", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/notes", icon: NotebookPen },
  { title: "Task Planner", url: "/planner", icon: ClipboardList },
  { title: "Research", url: "/research", icon: Search },
  { title: "AI Chatbot", url: "/chat", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Brain className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold text-sidebar-foreground">
              Workplace AI
            </span>
            <span className="text-[11px] text-sidebar-foreground/60">
              Productivity copilot
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
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

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium">
            {user?.email?.[0]?.toUpperCase() ?? <Sparkles className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs text-sidebar-foreground/80">
              {user?.email ?? "Signed in"}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
            onClick={async () => {
              await signOut();
              navigate({ to: "/login" });
            }}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
