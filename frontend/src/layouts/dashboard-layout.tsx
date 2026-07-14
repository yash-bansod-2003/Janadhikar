import { Navigate, Outlet, useParams } from "react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

import { BellRing, MessageCircleQuestionMark } from "lucide-react";
import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/loading";
import type { ApiResponse, Project, Profile } from "@/types";
import { useCurrentProject } from "@/context/project";
import { useEffect } from "react";
import { UserAccountNav } from "@/components/user-account-nav";

export default function DashboardLayout() {
  const { projectId } = useParams();
  const { setCurrentProject } = useCurrentProject();

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response =
        await httpClient.get<ApiResponse<Project[]>>("/projects");
      return response.data;
    },
  });

  const profileQuery = useQuery({
    queryKey: ["auth/profile"],
    queryFn: async () => {
      const response =
        await httpClient.get<ApiResponse<Profile>>("/auth/profile");
      return response.data;
    },
    retry: false,
  });

  // Sync URL projectId with context
  useEffect(() => {
    if (projectId && query.data?.data) {
      const project = query.data.data.find((p) => p.id === Number(projectId));
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, query.data, setCurrentProject]);

  if (query.isLoading || profileQuery.isLoading) {
    return <Loading />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="w-full flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-6"
            />
            <div className="flex gap-2 justify-end items-center flex-1">
              <ModeToggle />
              <Button
                size="icon-lg"
                variant="ghost"
                disabled
                title="Help feature coming soon"
                className="disabled:cursor-not-allowed"
              >
                <MessageCircleQuestionMark />
              </Button>
              <Button size="icon-lg" variant="ghost">
                <BellRing />
              </Button>
              <UserAccountNav user={profileQuery.data.data} />
            </div>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
