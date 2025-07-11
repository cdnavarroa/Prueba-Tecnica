import { Controller, Post, Param, Body, Delete } from '@nestjs/common';
import { UserTeamService } from '../services/userteam.service';

@Controller('teams/:teamId/users')
export class UserTeamController {
  constructor(private readonly userTeamService: UserTeamService) {}

  @Post()
  async addUsersToTeam(
    @Param('teamId') teamId: number,
    @Body('userIds') userIds: number[],
  ) {
    return this.userTeamService.addUsersToTeam(teamId, userIds);
  }

  @Delete()
  async removeUsersFromTeam(
    @Param('teamId') teamId: number,
    @Body('userIds') userIds: number[],
  ) {
    return this.userTeamService.removeUsersFromTeam(teamId, userIds);
  }
}
