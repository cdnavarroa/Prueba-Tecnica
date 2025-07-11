import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Team } from './team.model';

@Table({ tableName: 'UserTeams', timestamps: true })
export class UserTeam extends Model<UserTeam> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  userId: number;

  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  teamId: number;
}
