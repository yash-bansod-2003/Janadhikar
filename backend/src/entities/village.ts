import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  type Relation,
} from "typeorm";
import type { Facility } from "@/entities/facility";
import type { DevelopmentProject } from "@/entities/developmentProject";
import type { VillageGalleryImage } from "@/entities/villageGalleryImage";
import type { User } from "@/entities/user";

@Entity("villages")
@Index("IDX_VILLAGE_UNIQUE", ["name", "district", "taluka", "state"], {
  unique: true,
})
export class Village {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  district: string;

  @Column({ type: "text" })
  taluka: string;

  @Column({ type: "text" })
  state: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  pincode: string | null;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @Column({ type: "integer", nullable: true })
  population: number | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  area_sq_km: number | null;

  @ManyToOne("User", (user: User) => user.villages, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "created_by_user_id" })
  created_by_user: Relation<User | null>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: "datetime", nullable: true })
  deleted_at: Date | null;

  @OneToMany("Facility", (facility: Facility) => facility.village)
  facilities: Relation<Facility[]>;

  @OneToMany(
    "DevelopmentProject",
    (project: DevelopmentProject) => project.village,
  )
  developmentProjects: Relation<DevelopmentProject[]>;

  @OneToMany(
    "VillageGalleryImage",
    (image: VillageGalleryImage) => image.village,
  )
  galleryImages: Relation<VillageGalleryImage[]>;
}
