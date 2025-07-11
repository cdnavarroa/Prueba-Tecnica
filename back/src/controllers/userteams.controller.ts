import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserTeam } from '../models/userteam.model';

@Controller('userteams')
export class UserTeamsController {
  constructor(
    @InjectModel(UserTeam)
    private userTeamModel: typeof UserTeam,
  ) {}

  @Get()
  async findAll() {
    return await this.userTeamModel.findAll();
  }
}
