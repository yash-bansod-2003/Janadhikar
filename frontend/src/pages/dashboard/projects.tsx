import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { Button } from "@/components/ui/button";
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
import { Calendar, Clock, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/dashboard-header";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const formSchema = z.object({
  name: z
    .string()
    .min(5, "Project name must be at least 5 characters.")
    .max(32, "Project name must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
});

interface ProjectQueryResponse {
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
  data: {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  }[];
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await httpClient.get<ProjectQueryResponse>("/projects");
      return response.data;
    },
  });

  const projects = query.data?.data;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const createProject = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await httpClient.post("/projects", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project created successfully!", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error("Failed to create project", {
        description: errorMessage,
        position: "bottom-right",
      });
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    createProject.mutate(data);
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 w-full">
      <DashboardHeader
        title="Projects"
        description="Manage and view all your active projects and deployments."
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="size-4" /> Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new project.
              </DialogDescription>
            </DialogHeader>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-name">
                        Project Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. Antibody Discovery Phase 1"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-description">
                        Description
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="form-rhf-demo-description"
                          placeholder="e.g. This project tracks structure predictions for our modified antibody variants."
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
                      <FieldDescription>
                        Provide a brief summary of the research goals, targets,
                        or analysis expected in this project.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <DialogFooter>
              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={createProject.isPending}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  form="form-rhf-demo"
                  disabled={createProject.isPending}
                >
                  {createProject.isPending ? "Creating..." : "Submit"}
                </Button>
              </Field>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      {query.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-4/5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <Badge variant="secondary" className="font-normal text-xs">
                      Active
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardFooter className="border-t border-border/40 bg-muted/10 p-4 flex flex-col items-start gap-3 text-sm text-muted-foreground">
                <div className="flex flex-col space-y-1 w-full text-xs">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    Created: {formatDate(project.created_at)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-3.5 w-3.5" />
                    Updated: {formatDate(project.updated_at)}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
