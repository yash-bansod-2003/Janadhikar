import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  type Relation,
} from "typeorm";
import type { DevelopmentProject } from "@/entities/developmentProject";

@Entity("departments")
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("IDX_DEPARTMENT_NAME", { unique: true })
  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: "datetime", nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    "DevelopmentProject",
    (project: DevelopmentProject) => project.department,
  )
  projects: Relation<DevelopmentProject[]>;
}
