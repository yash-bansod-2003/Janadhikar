import React from "react";
import { ExternalLink, Info } from "lucide-react";
import { StructureViewer } from "@/components/structure-viewer";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { modelsInformationMock } from "@/data";

export function MetricSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader>
        <CardTitle className="text-xs tracking-widest uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">{children}</CardContent>
    </Card>
  );
}

export function MetricCard({ name, value }: { name: string; value: number }) {
  const isSuccess = Number(value) >= 80;
  const isMedium = Number(value) >= 50 && Number(value) < 80;

  return (
    <Card
      className={cn(
        "flex flex-1 border",
        isSuccess
          ? "border-green-500/50"
          : isMedium
            ? "border-yellow-500/50"
            : "border-red-500/50",
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            "text-xs tracking-widest uppercase font-bold",
            isSuccess
              ? "text-green-500"
              : isMedium
                ? "text-yellow-500"
                : "text-red-500",
          )}
        >
          {name}
        </CardTitle>
        <CardAction>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <Info className="size-4 text-blue-900" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              {modelsInformationMock[
                name.toLowerCase() as keyof typeof modelsInformationMock
              ] || "No information available for this model."}
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-lg font-semibold",
            isSuccess
              ? "text-green-500"
              : isMedium
                ? "text-yellow-500"
                : "text-red-500",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default function PremiumTable() {
  return (
    <div className="mt-6 w-full">
      <Card className="p-5 w-full shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <Card className="col-span-1 h-full flex flex-col gap-4 p-2 box-border">
            <div className="h-2/3 aspect-square relative">
              <StructureViewer
                className="h-full w-fullrounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center"
                pdbFilePath="http://localhost:8000/uploads/b2fabde7-9da5-415d-8316-e3ffe2a0b69b.pdb"
              />
              <Sheet>
                <SheetTrigger>
                  <ExternalLink className="absolute top-2 right-2 size-5" />
                </SheetTrigger>
                <SheetContent className="w-screen max-w-none h-full sm:w-[min(100vw,48rem)]">
                  <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                      3D Antibody Structure Prediction
                    </SheetDescription>
                  </SheetHeader>
                  <div className="h-full p-2 flex">
                    <div className="h-full w-2/3">
                      <StructureViewer
                        className="h-full w-full rounded-2xl bg-muted/30 flex items-center justify-center"
                        pdbFilePath="http://localhost:8000/uploads/b2fabde7-9da5-415d-8316-e3ffe2a0b69b.pdb"
                      />
                    </div>
                    <div className="h-full flex-1"></div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* <div className="border border-green-400 flex-1 box-border">
              <Button size="sm" variant="outline" className="rounded-full">
                Advance
              </Button>
            </div> */}
            {/* <p className="text-xs tracking-widest uppercase">Decision</p> */}
          </Card>

          <div className="col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricSection title="Manufacturing">
                <MetricCard name="DeepVisc" value={67} />
                <MetricCard name="Ensemble" value={46} />
              </MetricSection>

              <MetricSection title="Stability">
                <MetricCard name="ABB3" value={89} />
                <MetricCard name="Boltz" value={57} />
              </MetricSection>

              <MetricSection title="Aggregation">
                <MetricCard name="SAP H3" value={78} />
                <MetricCard name="SAP Fv" value={56} />
              </MetricSection>

              <MetricSection title="Pharmacology">
                <MetricCard name="AbLang2" value={97} />
                <MetricCard name="SaProt" value={90} />
              </MetricSection>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
