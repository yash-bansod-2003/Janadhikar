import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  type Relation,
} from "typeorm";
import type { DevelopmentProject } from "@/entities/developmentProject";
import { PROJECT_STATUS_VALUES, PROJECT_STATUSES } from "@/lib/constants";

@Entity("project_updates")
export class ProjectUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("IDX_PROJECT_UPDATE_PROJECT")
  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "date" })
  update_date: Date;

  @Column({ type: "integer", default: 0 })
  progress_percentage: number;

  @Column({
    type: "text",
    default: PROJECT_STATUSES.PLANNED,
  })
  status_after_update: PROJECT_STATUSES;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    "DevelopmentProject",
    (project: DevelopmentProject) => project.updates,
    {
      onDelete: "CASCADE",
      nullable: false,
    },
  )
  project: Relation<DevelopmentProject>;
}
