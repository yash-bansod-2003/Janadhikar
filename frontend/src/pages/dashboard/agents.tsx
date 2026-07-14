import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Calendar, Cpu, Layers } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";

interface AgentQueryResponse {
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
  data: {
    id: number;
    name: string;
    supported_input_types: string;
    version: string;
    description: string;
    categories: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }[];
}

export default function AgentsPage() {
  const query = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const response = await httpClient.get<AgentQueryResponse>(
        "/models?per_page=20",
      );
      return response.data;
    },
  });

  const agents = query.data?.data;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 w-full">
      <DashboardHeader
        title="AI Agents"
        description="Discover and manage available AI models and processing agents."
      />

      {query.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents?.map((agent) => (
            <Card
              key={agent.id}
              className="flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {agent.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={agent.is_active ? "default" : "destructive"}
                    className="font-normal text-xs"
                  >
                    {agent.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Activity className="h-3.5 w-3.5" /> Version {agent.version}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {agent.description || "No description provided."}
                </p>

                {agent.supported_input_types &&
                  agent.supported_input_types.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold flex items-center text-muted-foreground">
                        <Layers className="mr-1 h-3.5 w-3.5" /> Inputs
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.supported_input_types
                          .split(",")
                          .map((type, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-muted/50 text-xs font-normal"
                            >
                              {type}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                {agent.categories && agent.categories.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold flex items-center text-muted-foreground">
                      <Layers className="mr-1 h-3.5 w-3.5" /> Categories
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.categories.split(",").map((type, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-muted/50 text-xs font-normal"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t border-border/40 bg-muted/10 p-4 flex flex-col items-start gap-3 text-sm text-muted-foreground">
                <div className="flex items-center text-xs">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  Added: {formatDate(agent.created_at)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
