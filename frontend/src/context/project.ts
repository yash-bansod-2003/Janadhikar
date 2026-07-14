import type { Project } from "@/types";
import { create } from "zustand";

interface ProjectState {
  project: Project | null;
  setCurrentProject: (project: Project) => void;
}

export const useCurrentProject = create<ProjectState>((set) => ({
  project: null,
  setCurrentProject: (project: Project) => set({ project }),
}));
