import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useParams } from "react-router";
import { IconCloud } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { httpClient } from "@/lib/http-client";
import { Loading } from "@/components/loading";
import type { ApiResponse, Prediction } from "@/types";

import { Send } from "lucide-react";

import { PredictionViewer } from "@/components/prediction-viewer";
// import { MolStarWrapper } from "@/components/molstar-structure-viewer";

import { predictionResultMock } from "@/data";

export default function DashboardPage() {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { predictionId, projectId } = useParams();

  const predictionQuery = useQuery({
    queryKey: ["prediction", predictionId, projectId],
    queryFn: async () => {
      const response = await httpClient.get<
        ApiResponse<{ data: Prediction; success: boolean }>
      >(`/predictions/${predictionId}`);
      return response.data;
    },
    enabled: !!predictionId && !!projectId,
    refetchInterval: 8000,
  });

  if (predictionQuery.isLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
      <div className="flex-1 w-full space-y-4">
        {predictionQuery.data?.success && (
          <PredictionViewer prediction={predictionQuery.data.data} />
        )}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-4">
        <div className="flex w-full flex-col rounded-2xl border bg-card shadow-sm transition-all cursor-text focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <div className="relative flex-1 max-h-64.5 overflow-y-auto">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Initiate a query or send a command to AI..."
              className="min-h-12 w-full resize-none border-0 bg-transparent! p-3 text-[16px] text-foreground shadow-none outline-none transition-[padding] duration-200 ease-in-out whitespace-pre-wrap wrap-break-word focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex min-h-10 items-center gap-2 p-2 pb-1">
            <div className="flex aspect-1 items-center gap-1 rounded-full bg-muted p-1.5 text-xs">
              <IconCloud className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-lg"
                className={cn(
                  "cursor-pointer bg-primary transition-colors duration-100 ease-out",
                  inputValue && "bg-primary hover:bg-primary/90!",
                )}
                disabled={!inputValue}
                aria-label="Send message"
              >
                <Send className="size-4 text-primary-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// #94b909
// #8dcb55
// #031F7F
// #13A0AA
// #208c33
// #d8e021
