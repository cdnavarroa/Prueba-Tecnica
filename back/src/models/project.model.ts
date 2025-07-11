import { Table, Column, Model, DataType, HasMany, BelongsTo } from 'sequelize-typescript';
import { Task } from './task.model';

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @HasMany(() => Task)
  tasks: Task[];
}
