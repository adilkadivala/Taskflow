"use client";

import { useEffect } from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Activity,
  LayoutDashboard,
  ListChecks,
  Users,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TeamSwitcher } from "./team-switcher";
import { aboutUserApies } from "@/lib/user";
import { useAboutMeStore } from "@/store/about-me";

const data = {
  // teams

  teams: [
    // {
    //   name: "Acme Inc",
    //   logo: GalleryVerticalEnd,
    //   plan: "Enterprise",
    // },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],

  // main
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Task",
      url: "/dashboard/task-management",
      icon: ListChecks,
    },
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: Users,
    },
    {
      title: "Activity",
      url: "/dashboard/activity",
      icon: Activity,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { name, email, setMyInfo } = useAboutMeStore();

  const aboutMe = async () => {
    const result = await aboutUserApies.aboutMe();

    if (result.ok) {
      const detail = result.data.aboutMe.detail;

      const payload = {
        id: detail._id,
        name: detail.name,
        email: detail.email,
        role: result.data.aboutMe.role,
        teams: result.data.aboutMe.teams,
        soloTasks: result.data.aboutMe.soloTasks,
        assignedTasks: result.data.aboutMe.assignedTasks,
      };
      setMyInfo(payload);
    }
  };

  useEffect(() => {
    aboutMe();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        {data.teams.length > 0 && <TeamSwitcher teams={data.teams} />}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Workflow className="w-5 h-5 text-primary" />
                <span className="text-base font-semibold">TaskFlow</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: name ?? "", email: email ?? "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
