import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  type Relation,
} from "typeorm";
import type { Village } from "@/entities/village";
import type { Department } from "@/entities/department";
import type { ProjectUpdate } from "@/entities/projectUpdate";
import type { ProjectImage } from "@/entities/projectImage";
import type { ProjectDocument } from "@/entities/projectDocument";
import {
  PROJECT_CATEGORY_VALUES,
  PROJECT_CATEGORIES,
  PROJECT_STATUS_VALUES,
  PROJECT_STATUSES,
} from "@/lib/constants";

@Entity("development_projects")
export class DevelopmentProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("IDX_PROJECT_VILLAGE")
  @Column({ type: "text" })
  name: string;

  @Column({
    type: "text",
    default: PROJECT_CATEGORIES.OTHER,
  })
  category: PROJECT_CATEGORIES;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({
    type: "text",
    default: PROJECT_STATUSES.PLANNED,
  })
  status: PROJECT_STATUSES;

  @Column({ type: "date", nullable: true })
  approval_date: Date | null;

  @Column({ type: "date", nullable: true })
  start_date: Date | null;

  @Column({ type: "date", nullable: true })
  expected_completion_date: Date | null;

  @Column({ type: "date", nullable: true })
  actual_completion_date: Date | null;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  allocated_budget: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  spent_budget: number;

  @Column({ type: "integer", default: 0 })
  progress_percentage: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: "datetime", nullable: true })
  deleted_at: Date | null;

  @ManyToOne("Village", (village: Village) => village.developmentProjects, {
    onDelete: "CASCADE",
    nullable: false,
  })
  village: Relation<Village>;

  @ManyToOne("Department", (department: Department) => department.projects, {
    onDelete: "RESTRICT",
    nullable: false,
  })
  department: Relation<Department>;

  @OneToMany("ProjectUpdate", (update: ProjectUpdate) => update.project)
  updates: Relation<ProjectUpdate[]>;

  @OneToMany("ProjectImage", (image: ProjectImage) => image.project)
  images: Relation<ProjectImage[]>;

  @OneToMany("ProjectDocument", (document: ProjectDocument) => document.project)
  documents: Relation<ProjectDocument[]>;
}
