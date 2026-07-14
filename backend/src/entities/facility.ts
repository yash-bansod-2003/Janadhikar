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
import type { Village } from "@/entities/village";
import { FACILITY_TYPE_VALUES, FACILITY_TYPES } from "@/lib/constants";

@Entity("facilities")
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("IDX_FACILITY_VILLAGE_TYPE")
  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({
    type: "text",
    default: FACILITY_TYPES.OTHER,
  })
  type: FACILITY_TYPES;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: "datetime", nullable: true })
  deleted_at: Date | null;

  @ManyToOne("Village", (village: Village) => village.facilities, {
    onDelete: "CASCADE",
    nullable: false,
  })
  village: Relation<Village>;
}
