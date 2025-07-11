import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserTeam } from '../models/userteam.model';

@Injectable()
export class UserTeamService {
  constructor(
    @InjectModel(UserTeam)
    private userTeamModel: typeof UserTeam,
  ) {}

  async addUsersToTeam(teamId: number, userIds: number[]) {
    const records = userIds.map(userId => ({ userId, teamId }));
    // Bulk create, ignore duplicates
    await Promise.all(records.map(r => this.userTeamModel.findOrCreate({ where: r })));
    return { success: true };
  }

  async removeUsersFromTeam(teamId: number, userIds: number[]) {
    await this.userTeamModel.destroy({ where: { teamId, userId: userIds } });
    return { success: true };
  }
}
