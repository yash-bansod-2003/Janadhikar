import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ablang2HotspotResult } from "@/types";

type SequenceViewerProps = {
  hotspot: Ablang2HotspotResult;
  chain: "VH" | "VL";
};

const SequenceViewer = ({ hotspot, chain }: SequenceViewerProps) => {
  const sequenceScores = chain === "VH" ? hotspot.vh_scores : hotspot.vl_scores;
  const highlightedPositions = new Set(
    hotspot.hotspots
      .filter((item) => item.chain === (chain === "VH" ? "H" : "L"))
      .map((item) => item.position),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chain}</CardTitle>
      </CardHeader>
      <CardDescription>
        <div className="flex gap-3 flex-wrap px-4">
          {sequenceScores.map((entry) => (
            <div
              key={entry.position}
              className={cn(
                "size-5 flex items-center justify-center rounded",
                highlightedPositions.has(entry.position)
                  ? "size-6 bg-destructive/75 text-white font-bold border-destructive/50 border"
                  : "bg-muted/20 text-muted-foreground",
              )}
              title={`Position ${entry.position} ${entry.residue} ${entry.score.toFixed(4)}`}
            >
              {entry.residue}
            </div>
          ))}
        </div>
      </CardDescription>
    </Card>
  );
};

export default function HotspotAnalysis({
  hotspot,
}: {
  hotspot: Ablang2HotspotResult;
}) {
  console.log("Hotspot Analysis Data:", hotspot);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" strokeWidth={2.5} />
          <h3 className="font-semibold text-base sm:text-lg tracking-tight">
            Sequence Hotspot Analysis
          </h3>
        </CardTitle>
        <CardAction>
          <p className="text-destructive font-semibold">
            Top {hotspot.hotspots.length} degradation risk residues
          </p>
        </CardAction>
      </CardHeader>
      <CardContent className="bg-background/50 space-y-4 py-4">
        <SequenceViewer hotspot={hotspot} chain="VH" />
        <SequenceViewer hotspot={hotspot} chain="VL" />
      </CardContent>
      <CardFooter>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {hotspot.hotspots.map((mut, index) => (
            <div
              key={`${mut.chain}-${mut.position}-${index}`}
              className="flex items-center flex-wrap bg-background border border-border/60 rounded-lg p-3 text-sm shadow-sm gap-2.5 transition-all hover:bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-destructive/80 text-xs">
                  #{index + 1}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider",
                    mut.chain === "H"
                      ? "bg-destructive/10 text-destructive border-destructive/20 border"
                      : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 border",
                  )}
                >
                  {mut.chain === "H" ? "VH" : "VL"}
                </span>
                <span className="text-muted-foreground whitespace-nowrap text-xs font-medium">
                  Pos {mut.position}
                </span>
              </div>

              <div className="flex items-center gap-1.5 ml-auto sm:ml-0 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                <span className="font-bold font-mono text-foreground text-xs">
                  {mut.residue}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                <div className="flex flex-wrap gap-1.5 border-l border-border/60 pl-1.5">
                  {mut.suggestions.map((suggestion) => (
                    <div
                      key={suggestion.residue}
                      className="flex items-center gap-1 bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-500/20"
                    >
                      <span className="font-mono font-semibold text-[11px]">
                        {suggestion.residue}
                      </span>
                      <span className="text-[10px] font-medium opacity-80">
                        {suggestion.probability}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
