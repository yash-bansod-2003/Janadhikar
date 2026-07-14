import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DeepViscosityExplanation } from "@/types";

export const description = "Separate SHAP and LIME analysis charts";
export const iframeHeight = "600px";
export const containerClassName =
  "[&>div]:w-full [&>div]:max-w-md flex items-center justify-center min-h-svh";

const shapConfig = {
  shap: {
    label: "SHAP Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const limeConfig = {
  lime: {
    label: "LIME Weight",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ShapLimeViewer({
  explanation,
}: {
  explanation: DeepViscosityExplanation;
}) {
  const shapData = [];
  const limeData = [];

  for (const shap of explanation.shap) {
    console.log("shap", shap);
    shapData.push({
      feature: shap.Feature,
      shap: shap.SHAP_value,
    });
  }

  for (const lime of explanation.lime) {
    limeData.push({
      feature: lime.Feature,
      lime: lime.Weight,
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* SHAP Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">SHAP Values</CardTitle>
          <CardDescription>
            Feature importance based on SHAP analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={shapConfig}>
            <BarChart
              accessibilityLayer
              data={shapData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <XAxis
                dataKey="feature"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Bar
                dataKey="shap"
                fill="var(--color-shap)"
                radius={[8, 8, 0, 0]}
              />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* LIME Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            LIME Weights
          </CardTitle>
          <CardDescription>
            Feature importance based on LIME analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={limeConfig}>
            <BarChart
              accessibilityLayer
              data={limeData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <XAxis
                dataKey="feature"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Bar
                dataKey="lime"
                fill="var(--color-lime)"
                radius={[8, 8, 0, 0]}
              />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
