import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { queryClient } from "./providers";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupText,
} from "./ui/input-group";
import type { ApiResponse, Project } from "@/types";
import { useCurrentProject } from "@/context/project";
import { useNavigate } from "react-router";

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

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type ProjectSwitcherProps = PopoverTriggerProps & {
  projects: Project[];
};

export default function ProjectSwitcher({
  className,
  projects,
}: ProjectSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const { project: selectedProject, setCurrentProject } = useCurrentProject();
  const navigate = useNavigate();
  const [showProjectTeamDialog, setShowProjectTeamDialog] =
    React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createProject = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await httpClient.post<ApiResponse<Project>>(
        "/projects",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Project created successfully!", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      setShowProjectTeamDialog(false);
      setCurrentProject(data.data);
      navigate(`/dashboard/projects/${data.data.id}/predict/new`);
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
    <Dialog
      open={projects.length !== 0 ? showProjectTeamDialog : true}
      onOpenChange={setShowProjectTeamDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("justify-between h-12", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedProject?.name}.png`}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedProject?.name.slice(0, 20)}
            <ChevronsUpDown className="ml-auto opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="ml-3 w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search project..." />
            <CommandList>
              <CommandEmpty>No Project found.</CommandEmpty>
              <CommandGroup heading="Your Projects">
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      setCurrentProject(project);
                      queryClient.invalidateQueries({
                        queryKey: ["predictions", project.id],
                      });
                      queryClient.invalidateQueries({
                        queryKey: ["predictions"],
                      });
                      setOpen(false);
                      navigate(`/dashboard/projects/${project.id}/predict/new`);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${project.name}.png`}
                        className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {project.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedProject?.id === project.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowProjectTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="h-5 w-5" />
                    Create Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
                    Provide a brief summary of the research goals, targets, or
                    analysis expected in this project.
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
  );
}
