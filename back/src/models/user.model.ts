import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Task } from './task.model';
import { Team } from './team.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM('admin', 'member'),
    allowNull: false,
    defaultValue: 'member',
  })
  declare role: string;

  @HasMany(() => Task)
  tasks: Task[];

  @BelongsToMany(() => Team, 'UserTeams', 'userId', 'teamId')
  teams: Team[];
}
