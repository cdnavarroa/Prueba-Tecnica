import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Team extends Model<Team> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => User, 'UserTeams', 'teamId', 'userId')
  users: User[];
}
