import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserTeam } from '../models/userteam.model';
import { UserTeamsController } from '../controllers/userteams.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserTeam])],
  controllers: [UserTeamsController],
})
export class UserTeamsModule {}
