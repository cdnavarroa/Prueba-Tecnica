import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team)
    private teamModel: typeof Team,
  ) {}

  async findAll() {
    return this.teamModel.findAll();
  }

  async findOne(id: number) {
    return this.teamModel.findByPk(id);
  }

  async create(data: any) {
    return this.teamModel.create(data);
  }

  async update(id: number, data: any) {
    const team = await this.teamModel.findByPk(id);
    if (!team) return null;
    return team.update(data);
  }

  async remove(id: number) {
    const team = await this.teamModel.findByPk(id);
    if (!team) return null;
    await team.destroy();
    return true;
  }

  async getTeamUsers(id: number) {
    // Traer los userteams para este equipo
    const team = await this.teamModel.findByPk(id);
    if (!team) return [];
    const userteams = await (this.teamModel.sequelize as any).models.UserTeam.findAll({ where: { teamId: id } });
    const userIds = userteams.map((ut: any) => ut.userId);
    const users = await (this.teamModel.sequelize as any).models.User.findAll({ where: { id: userIds } });
    // Devolver [{ user: {...}, userteam: {...} }]
    return userteams.map((ut: any) => {
      const user = users.find((u: any) => u.id === ut.userId);
      return { user, userteam: ut };
    });
  }
}
