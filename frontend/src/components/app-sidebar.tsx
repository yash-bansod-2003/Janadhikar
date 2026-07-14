import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  PlusCircle,
  Settings2,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavHistories } from "@/components/nav-histories";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import ProjectSwitcher from "./project-switcher";
import type { ApiResponse, Prediction, Project } from "@/types";
import { useCurrentProject } from "@/context/project";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Agents",
      isActive: true,
      url: "/dashboard/agents",
      icon: Bot,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
  histories: [
    {
      name: "Design Engineering",
      timestamp: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      timestamp: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      timestamp: "#",
      icon: Map,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { project, setCurrentProject } = useCurrentProject();
  const predictionsQuery = useQuery({
    queryKey: ["predictions", project?.id],
    queryFn: async () => {
      if (!project?.id) return null;
      const response = await httpClient.get<ApiResponse<Prediction[]>>(
        `/${project.id}/predictions`,
      );
      return response.data;
    },
    enabled: !!project?.id,
  });

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response =
        await httpClient.get<ApiResponse<Project[]>>("/projects");
      return response.data;
    },
  });

  if (!project && projectsQuery.data?.data.length) {
    setCurrentProject(projectsQuery.data?.data[0]);
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
            <Icons.logo className="size-full" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">Aurigene</span>
            <span className="truncate text-xs">Pharmaceutical Services</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Link
          to={`/dashboard/projects/${project?.id}/predict/new`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "ml-3 my-2 w-[calc(100%-1.5rem)] group-data-[collapsible=icon]:hidden",
          )}
        >
          <PlusCircle className="mr-1 h-4 w-4 font-bold" />
          Predict Protein Sequence
        </Link>
        <NavMain items={data.navMain} />
        {predictionsQuery.data && (
          <NavHistories histories={predictionsQuery.data.data || []} />
        )}
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        {projectsQuery.data && (
          <ProjectSwitcher projects={projectsQuery.data.data || []} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
