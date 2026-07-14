import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  type Relation,
} from "typeorm";

import { ROLES } from "@/lib/constants";
import type { RefreshToken } from "@/entities/refreshToken";
import type { Village } from "@/entities/village";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({
    type: "text",
    default: ROLES.USER,
  })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany("RefreshToken", (refreshToken: RefreshToken) => refreshToken.user)
  refreshTokens: Relation<RefreshToken[]>;

  @OneToMany("Village", (village: Village) => village.created_by_user)
  villages: Relation<Village[]>;
}
