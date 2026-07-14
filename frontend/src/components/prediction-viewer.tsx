import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import {
  IconDeviceFloppy,
  IconFileSpreadsheet,
  IconDownload,
} from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import HotspotAnalysis from "@/components/hotspot-analysis";

import StatisticsCard from "@/components/shadcn-space/card/card-06";
import { MetricCard } from "@/pages/dashboard/table";

import type {
  Ablang2PredictionResult,
  Abodybuilder3PredictionResult,
  DeepViscosityPredictionResult,
  Prediction,
} from "@/types";
import { calculateScore } from "@/lib/utils";
import { SequenceCard } from "./sequence-card";
import { Coffee, ExternalLink } from "lucide-react";
import { ShapLimeViewer } from "./shap-lime-viewer";
import { Icons } from "./icons";
// import { MolStarWrapper } from "./molstar-structure-viewer";

const categoriesRegistry = [
  {
    title: "Manufacturing",
    value: "manufacturing",
    cardIcon: "solar:box-line-duotone",
    badgeColor: "bg-teal-400/10",
  },
  {
    title: "Stability",
    value: "stability",
    cardIcon: "solar:bag-4-line-duotone",
    badgeColor: "bg-orange-400/10",
  },
  {
    title: "Aggregation",
    value: "aggregation",
    cardIcon: "solar:star-line-duotone",
    badgeColor: "bg-teal-400/10",
  },
  {
    title: "Pharmacology",
    value: "pharmacology",
    cardIcon: "solar:star-line-duotone",
    badgeColor: "bg-teal-400/10",
  },
  {
    title: "Structure",
    value: "structure",
    cardIcon: "tdesign:map-3d",
    badgeColor: "bg-teal-400/10",
  },
];

export const PredictionViewer = ({
  prediction,
}: {
  prediction: Prediction;
}) => {
  console.log("PredictionViewer", prediction);
  const categories = prediction.predictionResults
    .filter((result) =>
      result.model.supported_input_types.includes(prediction.input_type),
    )
    .reduce(
      (acc, result) => {
        const categories = result.model.categories.split(",");

        for (const category of categories) {
          if (category === "structure") {
            continue;
          }
          if (!acc.find((item) => item.value === category)) {
            const uniqueCategory = categoriesRegistry.find(
              (cat) => cat.value === category,
            );
            const predictionResults = prediction.predictionResults.filter(
              (res) => res.model.categories.split(",").includes(category),
            );
            const averageScore = Math.round(
              predictionResults.reduce((sum, item) => {
                const score = calculateScore(item);
                return sum + score;
              }, 0) / predictionResults.length,
            );
            acc.push({
              title: uniqueCategory?.title || category,
              cardIcon: uniqueCategory?.cardIcon || "solar:box-line-duotone",
              score: averageScore,
              value: category as
                | "manufacturing"
                | "aggregation"
                | "pharmacology"
                | "stability"
                | "structure",
              models: predictionResults.length,
            });
          }
        }
        return acc;
      },
      [] as {
        title: string;
        cardIcon: string;
        score: number;
        value:
        | "manufacturing"
        | "aggregation"
        | "pharmacology"
        | "stability"
        | "structure";
        models: number;
      }[],
    );

  const abodybuilder3RawOutput = prediction.predictionResults.find(
    (result) => result.model.name === "abodybuilder3",
  )?.raw_output;

  const pdbFilePath = (
    abodybuilder3RawOutput as Abodybuilder3PredictionResult[]
  )?.[0]?.pdb;

  console.log("pdbFilePath", pdbFilePath);

  const pdbFileFullPath = `http://localhost:5000/uploads/${pdbFilePath}`;

  const hotspots = prediction.predictionResults.find(
    (result) => result.model.name === "ablang2",
  )?.raw_output as unknown as Ablang2PredictionResult[];

  const shapLimeExplanation = prediction.predictionResults.find(
    (result) => result.model.name === "deepviscosity",
  )?.raw_output as unknown as DeepViscosityPredictionResult[];

  console.log("shapLimeExplanation", shapLimeExplanation);

  console.log("categories", categories);
  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold tracking-tight">
                Input Sequences Analysis
              </CardTitle>
              <CardAction className="flex items-center">
                <span
                  className={cn(
                    "ml-1 text-sm font-bold tracking-wide flex items-center",
                    prediction.status === "COMPLETED"
                      ? "text-green-500"
                      : prediction.status === "FAILED"
                        ? "text-red-500"
                        : "text-yellow-500",
                  )}
                >
                  {prediction.status === "COMPLETED" && (
                    <Icons.check className="mr-2 size-5" />
                  )}
                  {prediction.status === "FAILED" && (
                    <Icons.x className="mr-2 size-5" />
                  )}
                  {prediction.status === "PENDING" && (
                    <Icons.loader className="mr-2 size-5 animate-spin" />
                  )}
                  {prediction.status || "unknown"}

                  {prediction.status === "COMPLETED" && (
                    <span className="ml-2">
                      ({Math.round(
                        (new Date(prediction.updated_at).getTime() -
                          new Date(prediction.created_at).getTime()) /
                        (1000 * 60)
                      )}{" "}
                      Min)
                    </span>
                  )}
                </span>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            {prediction.input_type === "FULL_SEQ" ? (
              <SequenceCard
                title="Full Sequence"
                sequence={prediction.input_payload[0]?.full_sequence || ""}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SequenceCard
                  title="Heavy Chain (VH)"
                  sequence={prediction.input_payload[0]?.vh_sequence || ""}
                />
                <SequenceCard
                  title="Light Chain (VL)"
                  sequence={prediction.input_payload[0]?.vl_sequence || ""}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold tracking-tight">
                Overall Statistics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-fit max-w-full">
            <StatisticsCard categories={categories} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="hidden cursor-not-allowed text-muted-foreground disabled:cursor-not-allowed sm:flex hover:text-foreground"
          disabled
          title="Save feature coming soon"
        >
          <IconDeviceFloppy className="mr-2 h-4 w-4" />
          <span>Save</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <IconFileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export CSV</span>
        </Button>
        {pdbFilePath && (
          <Link
            to={pdbFileFullPath}
            className={cn(buttonVariants({ size: "sm" }), "shadow-sm")}
          >
            <IconDownload className="mr-2 h-4 w-4" />
            <span>Download PDB</span>
          </Link>
        )}
      </div>

      {prediction.status === "COMPLETED" ? (
        <>
          {pdbFilePath && (
            <div className="flex flex-col gap-6 w-full">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      3D Structure
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="w-full flex items-center justify-center">
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "shadow-sm",
                    )}
                    to={`/dashboard/structure-viewer/${pdbFilePath}`}
                  >
                    Go to Structure Viewer
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {shapLimeExplanation && (
            <div className="flex flex-col gap-6 w-full">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      Shap & Lime Analysis
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-fit max-w-full">
                  {shapLimeExplanation[0]?.explanations[0] && (
                    <ShapLimeViewer
                      explanation={shapLimeExplanation[0]?.explanations[0]}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="bg-card space-y-4 border p-4 rounded-lg">
            {categories.map((category, index) => {
              const relatedResults = prediction.predictionResults.filter(
                (result) =>
                  result.model.categories.split(",").includes(category.value),
              );
              return (
                <div
                  className="flex flex-col gap-6 w-full"
                  key={`${category.value}-${index}`}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold tracking-tight">
                          {category.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="w-ful grid grid-cols-1 gap-4 md:grid-cols-5">
                      {relatedResults.map((result) => {
                        if (result.status !== "COMPLETED") {
                          return (
                            <Card>
                              <CardContent className="flex items-center justify-center">
                                <p>Computing...</p>
                              </CardContent>
                            </Card>
                          );
                        }
                        return (
                          <MetricCard
                            key={result.model.name}
                            name={result.model.name}
                            value={Number(calculateScore(result)?.toFixed(2))}
                          />
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-muted/30 p-12">
          <div className="text-muted-foreground flex flex-col items-center gap-4">
            <Coffee className="size-12 animate-bounce" />
            Prediction results will appear here once completed. Please have some
            coffee while you wait.
          </div>
        </div>
      )}

      {hotspots && hotspots[0]?.hotspots[0] && (
        <HotspotAnalysis hotspot={hotspots[0].hotspots[0]} />
      )}
    </>
  );
};
