import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@EntityModel()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({
    default: false,
  })
  completed: boolean;

  @Column({ default: 1, nullable: false })
  priority: number; // Task priority from 1 (normal, default value) to 4 (urgent).

  @Column({ default: 1, nullable: false })
  order: number; // Position under the same parent

  @CreateDateColumn({
    name: 'gmt_create',
  })
  createdOn: Date;

  @UpdateDateColumn({
    name: 'gmt_modified',
  })
  modifiedOn: Date;

  @DeleteDateColumn({
    name: 'gmt_deleted',
  })
  deletedOn: Date;
}
