import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dna,
  Beaker,
  Zap,
  ArrowRight,
  Upload,
  Info,
  Cog,
  Plus,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Tabs } from "radix-ui";
import { useParams, useNavigate } from "react-router";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldTitle,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { useCurrentProject } from "@/context/project";
import type { ApiResponse, Prediction } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

type SequenceTabValue = "vl_vh" | "full_sequence";

type FormValues = {
  vh_sequence?: string;
  vl_sequence?: string;
  full_sequence?: string;
};

function buildFormSchema(tab: SequenceTabValue) {
  return z
    .object({
      vh_sequence: z.string().trim().optional(),
      vl_sequence: z.string().trim().optional(),
      full_sequence: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
      const vh = data.vh_sequence?.trim() ?? "";
      const vl = data.vl_sequence?.trim() ?? "";
      const full = data.full_sequence?.trim() ?? "";

      if (tab === "vl_vh") {
        if (!vh) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vh_sequence"],
            message: "VH sequence is required.",
          });
        } else if (vh.length < 5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vh_sequence"],
            message: "VH sequence must be at least 5 characters.",
          });
        } else if (vh.length > 256) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vh_sequence"],
            message: "VH sequence must be at most 256 characters.",
          });
        }

        if (!vl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vl_sequence"],
            message: "VL sequence is required.",
          });
        } else if (vl.length < 5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vl_sequence"],
            message: "VL sequence must be at least 5 characters.",
          });
        } else if (vl.length > 256) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vl_sequence"],
            message: "VL sequence must be at most 256 characters.",
          });
        }
      } else {
        if (!full) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["full_sequence"],
            message: "Full sequence is required.",
          });
        } else if (full.length < 5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["full_sequence"],
            message: "Full sequence must be at least 5 characters.",
          });
        } else if (full.length > 800) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["full_sequence"],
            message: "Full sequence must be at most 800 characters.",
          });
        }
      }
    });
}

export default function SequenceInputPage() {
  const params = useParams();
  const projectId = params.projectId;
  const { project } = useCurrentProject();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [additionalSettings, setAdditionalSettings] = React.useState({
    stability: false,
    manufacturing: false,
    aggregation: false,
    pharmacology: false,
    fast_screening: false,
    custom: false,
  });

  const [activeTab, setActiveTab] = React.useState<SequenceTabValue>("vl_vh");

  const createPrediction = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log("Submitting prediction with data:", data);
      if (data.vh_sequence && data.vl_sequence) {
        const response = await httpClient.post<ApiResponse<Prediction>>(
          `/predictions`,
          {
            input_type: "VH_VL",
            input_payload: [
              {
                vh_sequence: data.vh_sequence,
                vl_sequence: data.vl_sequence,
              },
            ],
            project: {
              id: Number(projectId),
            },
            additionalSettings,
          },
        );
        return response.data;
      }

      if (data.full_sequence) {
        const response = await httpClient.post<ApiResponse<Prediction>>(
          `/predictions`,
          {
            input_type: "FULL_SEQ",
            input_payload: [
              {
                full_sequence: data.full_sequence,
              },
            ],
            project: {
              id: Number(projectId),
            },
            additionalSettings,
          },
        );
        return response.data;
      }

    },
    onSuccess: (data) => {
      toast.success("Prediction created successfully!", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["predictions", project?.id] });
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      form.reset();
      navigate(`/dashboard/projects/${projectId}/predict/${data.data.id}`);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error("Failed to create prediction", {
        description: errorMessage,
        position: "bottom-right",
      });
    },
  });

  const form = useForm<FormValues>({
    defaultValues: {
      vh_sequence: "",
      vl_sequence: "",
      full_sequence: "",
    },
  });

  function onSubmit(data: FormValues) {
    const result = buildFormSchema(activeTab).safeParse(data);

    if (!result.success) {
      form.clearErrors();
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          form.setError(field as keyof FormValues, {
            type: "manual",
            message: issue.message,
          });
        }
      });
      return;
    }

    createPrediction.mutate(data);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full overflow-y-auto pb-12">
      <DashboardHeader
        title="Sequence Input"
        description="Enter your antibody sequences to run predictions and analyses."
      />

      <Tabs.Root
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as SequenceTabValue);
          form.clearErrors();
        }}
      >
        <div className="mb-4 rounded-2xl border border-border/60 bg-muted/20 p-4 shadow-sm sm:mb-5 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  Choose how you want to submit antibody input
                </h2>
                <Badge variant="outline" className="text-[11px]">
                  Guided workflow
                </Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Select the format that best matches your data. Each option is
                tailored to make the form feel simpler and more predictable.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Cog className="w-4 h-4 mr-2" />
                  Additional Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-4xl">
                <DialogHeader>
                  <DialogTitle>Workflow Settings</DialogTitle>
                  <DialogDescription>
                    Select one or more workflows. Leave all unchecked to run the
                    full pipeline.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 w-full gap-4">
                  <Field orientation="horizontal" className="border p-3">
                    <Checkbox
                      checked={additionalSettings.stability}
                      onCheckedChange={(checked) =>
                        setAdditionalSettings({
                          ...additionalSettings,
                          stability: !!checked,
                        })
                      }
                      id="workflow-stability"
                      name="workflow-stability"
                    />
                    <FieldContent>
                      <FieldTitle>Stability</FieldTitle>
                      <FieldDescription>
                        Structure + thermostability
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal" className="border p-3">
                    <Checkbox
                      checked={additionalSettings.manufacturing}
                      onCheckedChange={(checked) =>
                        setAdditionalSettings({
                          ...additionalSettings,
                          manufacturing: !!checked,
                        })
                      }
                      id="workflow-manufacturing"
                      name="workflow-manufacturing"
                    />
                    <FieldContent>
                      <FieldTitle>Manufacturing</FieldTitle>
                      <FieldDescription>Viscosity prediction</FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal" className="border p-3">
                    <Checkbox
                      checked={additionalSettings.aggregation}
                      onCheckedChange={(checked) =>
                        setAdditionalSettings({
                          ...additionalSettings,
                          aggregation: !!checked,
                        })
                      }
                      id="workflow-aggregation"
                      name="workflow-aggregation"
                    />
                    <FieldContent>
                      <FieldTitle>Aggregation</FieldTitle>
                      <FieldDescription>
                        Spatial aggregation propensity
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal" className="border p-3">
                    <Checkbox
                      checked={additionalSettings.pharmacology}
                      onCheckedChange={(checked) =>
                        setAdditionalSettings({
                          ...additionalSettings,
                          pharmacology: !!checked,
                        })
                      }
                      id="workflow-pharmacology"
                      name="workflow-pharmacology"
                    />
                    <FieldContent>
                      <FieldTitle>Pharmacology</FieldTitle>
                      <FieldDescription>
                        Sequence fitness + immunogenicity
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal" className="border p-3">
                    <Checkbox
                      checked={additionalSettings.fast_screening}
                      onCheckedChange={(checked) =>
                        setAdditionalSettings({
                          ...additionalSettings,
                          fast_screening: !!checked,
                        })
                      }
                      id="workflow-fast-screening"
                      name="workflow-fast-screening"
                    />
                    <FieldContent>
                      <FieldTitle>Fast Screening</FieldTitle>
                      <FieldDescription>
                        Lightweight sequence-level only
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal" className="border p-3">
                    <Checkbox
                      checked={additionalSettings.custom}
                      onCheckedChange={(checked) =>
                        setAdditionalSettings({
                          ...additionalSettings,
                          custom: !!checked,
                        })
                      }
                      id="workflow-custom"
                      name="workflow-custom"
                    />
                    <FieldContent>
                      <FieldTitle>Custom</FieldTitle>
                      <FieldDescription>
                        Keyword-guided selection
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Tabs.List
          className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3 shrink-0 mb-4"
          aria-label="Sequence Input Types"
        >
          <Tabs.Trigger
            value="vl_vh"
            data-slot="tabs-trigger"
            className={cn(
              "group flex flex-col gap-2.5 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
              "data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-primary/20",
              "data-[state=inactive]:border-border/60 data-[state=inactive]:bg-card",
              "hover:bg-muted/50 hover:border-border",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg w-fit shadow-sm",
                "group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary-foreground",
                "group-data-[state=inactive]:bg-muted group-data-[state=inactive]:text-muted-foreground",
              )}
            >
              <Dna
                className={cn(
                  "size-5",
                  "group-data-[state=active]:text-primary group-data-[state=inactive]:text-muted-foreground",
                )}
              />
            </div>
            <div>
              <h3
                className={cn(
                  "font-semibold text-sm",
                  "tabs-trigger:data-[state=active]:text-foreground tabs-trigger:data-[state=inactive]:text-foreground/80",
                )}
              >
                VH & VL Sequences
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Provide Heavy (VH) and Light (VL) chain sequences separately
              </p>
            </div>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="full_sequence"
            data-slot="tabs-trigger"
            className={cn(
              "group flex flex-col gap-2.5 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
              "data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-primary/20",
              "data-[state=inactive]:border-border/60 data-[state=inactive]:bg-card",
              "hover:bg-muted/50 hover:border-border",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg w-fit shadow-sm",
                "group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary-foreground",
                "group-data-[state=inactive]:bg-muted group-data-[state=inactive]:text-muted-foreground",
              )}
            >
              <Beaker
                className={cn(
                  "size-5",
                  "group-data-[state=active]:text-primary group-data-[state=inactive]:text-muted-foreground",
                )}
              />
            </div>
            <div>
              <h3
                className={cn(
                  "font-semibold text-sm",
                  "data-[state=active]:text-foreground data-[state=inactive]:text-foreground/80",
                )}
              >
                Full Protein Sequence
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Provide the complete antibody sequence
              </p>
            </div>
          </Tabs.Trigger>

          <Tabs.Trigger
            disabled
            value="cdrs_only"
            data-slot="tabs-trigger"
            className={cn(
              "group flex flex-col gap-2.5 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
              "data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-primary/20",
              "data-[state=inactive]:border-border/60 data-[state=inactive]:bg-card",
              "hover:bg-muted/50 hover:border-border",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg w-fit shadow-sm",
                "group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary-foreground",
                "group-data-[state=inactive]:bg-muted group-data-[state=inactive]:text-muted-foreground",
              )}
            >
              <Zap
                className={cn(
                  "size-5",
                  "group-data-[state=active]:text-primary group-data-[state=inactive]:text-muted-foreground",
                )}
              />
            </div>
            <div>
              <h3
                className={cn(
                  "font-semibold text-sm",
                  "data-[state=active]:text-foreground data-[state=inactive]:text-foreground/80",
                )}
              >
                CDR Sequences
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Provide only the CDR sequences
              </p>
            </div>
          </Tabs.Trigger>

          <div className="border-dotted border-2 border-primary/60 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-muted/50">
            <Plus className="size-10 text-primary/60" />
          </div>
        </Tabs.List>
        <div className="flex items-center justify-start mb-4"></div>
        <Tabs.Content value="vl_vh">
          <Card className="flex flex-col border-border/60 shadow-sm bg-background shrink-0">
            <CardHeader className="bg-muted/20 border-b border-border/40 pb-4 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold tracking-tight">
                  Enter VH & VL Sequences
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 text-muted-foreground hidden sm:flex disabled:cursor-not-allowed"
                  disabled
                  title="FASTA upload feature coming soon"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload FASTA
                </Button>
              </div>
            </CardHeader>

            <CardContent className="w-full p-5 md:p-6">
              <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="vh_sequence"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-vh-sequence">
                          VH Sequence
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="form-rhf-demo-vh-sequence"
                            placeholder="Enter the VH sequence"
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field.value.length}/100 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="vl_sequence"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-vl-sequence">
                          VL Sequence
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="form-rhf-demo-vl-sequence"
                            placeholder="Enter the VL sequence"
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field.value.length}/100 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="border-t border-border/40 bg-muted/10 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto">
                <div className="flex items-center">
                  <Info className="w-4 h-4 mr-1.5" />
                  Automatically validates alphabetic sequence characters
                </div>
              </div>
              <Field className="w-fit" orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit" form="form-rhf-demo">
                  Run Prediction Models
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Field>
            </CardFooter>
          </Card>
        </Tabs.Content>
        <Tabs.Content value="full_sequence">
          <Card className="flex flex-col border-border/60 shadow-sm bg-background shrink-0">
            <CardHeader className="bg-muted/20 border-b border-border/40 pb-4 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold tracking-tight">
                  Enter Full Protein Sequence
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 text-muted-foreground hidden sm:flex disabled:cursor-not-allowed"
                  disabled
                  title="FASTA upload feature coming soon"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload FASTA
                </Button>
              </div>
            </CardHeader>

            <CardContent className="w-full p-5 md:p-6">
              <form
                id="form-rhf-full-sequence"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name="full_sequence"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-vh-sequence">
                          Protein Sequence
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="form-rhf-demo-vh-sequence"
                            placeholder="Enter the full protein sequence"
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field.value.length}/800 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="border-t border-border/40 bg-muted/10 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto">
                <div className="flex items-center">
                  <Info className="w-4 h-4 mr-1.5" />
                  Automatically validates alphabetic sequence characters
                </div>
              </div>
              <Field className="w-fit" orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button disabled={createPrediction.isPending} type="submit" form="form-rhf-full-sequence">
                  {createPrediction.isPending && (
                    <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Run Prediction Models
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Field>
            </CardFooter>
          </Card>
        </Tabs.Content>
        <Tabs.Content value="cdrs_only">
          <h1>Not Implemented</h1>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
