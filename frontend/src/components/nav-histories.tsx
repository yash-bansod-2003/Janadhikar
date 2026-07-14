import { Box, Calendar } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router";
// import { StructureViewer } from "@/components/structure-viewer";
import type { Prediction } from "@/types";
import { useCurrentProject } from "@/context/project";

export type HistoryStatus = "completed" | "pending" | "error";

export function NavHistories({ histories }: { histories: Prediction[] }) {
  const { project } = useCurrentProject();

  const enhanceHistory = (item: Prediction) => ({
    ...item,
    status: item.status || "completed",
    models: ["DeepVisc", "AbLang2", "SaProt", "Boltz"],
  });

  if (!project) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Recent Analysis
      </SidebarGroupLabel>
      <SidebarMenu>
        <ScrollArea className="h-[calc(100vh-21.5rem)] pr-3 -mr-3">
          <div className="flex flex-col gap-2.5 pb-4">
            {histories.map((rawItem, idx) => {
              const item = enhanceHistory(rawItem);
              const displayModels = item.models.slice(0, 2);
              const extraModels = item.models.length - 2;

              return (
                <Link
                  to={`/dashboard/projects/${project.id}/predict/${item.id}`}
                  key={idx}
                  className="group flex flex-col gap-3 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/40 cursor-pointer shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex gap-3 items-start">
                    {/* 3D Preview Thumbnail Placeholder */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-muted/50 to-muted border border-border/60 shadow-inner overflow-hidden relative">
                      <Box className="h-5 w-5 text-muted-foreground/30 absolute" />
                      <span className="text-[9px] font-bold text-muted-foreground/70 z-10">
                        3D
                      </span>
                    </div>

                    {/* <StructureViewer
                      className="h-10 w-10"
                      pdbFilePath="http://localhost:8000/uploads/b2fabde7-9da5-415d-8316-e3ffe2a0b69b.pdb"
                    /> */}

                    {/* Title, Date & Status */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                          {item.name} ({item.id})
                        </span>
                        {/* <StatusIcon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            statusConfig[status].color,
                          )}
                        /> */}
                      </div>
                      <div className="flex items-center text-[10px] text-muted-foreground mt-0.5">
                        <Calendar className="h-2.5 w-2.5 mr-1 opacity-70" />
                        {item.created_at.slice(0, 10)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Inputs and Models */}
                  <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2.5 mt-0.5">
                    {/* Inputs */}
                    <div className="flex gap-1">
                      <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/50">
                        {item.input_type === "VH_VL" ? "VH/VL" : "Full Seq"}
                      </span>
                    </div>

                    {/* Models */}
                    <div className="flex items-center gap-1">
                      {displayModels.map((m: string) => (
                        <span
                          key={m}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {m}
                        </span>
                      ))}
                      {extraModels > 0 && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                          +{extraModels}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </SidebarMenu>
    </SidebarGroup>
  );
}
