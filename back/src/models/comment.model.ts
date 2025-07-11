import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Task } from './task.model';
import { User } from './user.model';
import { Team } from './team.model';  // Importa el modelo Team

@Table
export class Comment extends Model<Comment> {
  @Column(DataType.TEXT)
  declare content: string;

  @ForeignKey(() => Task)
  @Column
  declare taskId: number;

  @BelongsTo(() => Task)
  declare task: Task;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  // Relación con Team
  @ForeignKey(() => Team)
  @Column
  declare teamId: number;  // Agrega esta columna
  @BelongsTo(() => Team)
  declare team: Team;  // Relaciona el comentario con un equipo
}
