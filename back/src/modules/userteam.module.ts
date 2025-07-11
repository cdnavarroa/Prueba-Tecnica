import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserTeam } from '../models/userteam.model';
import { UserTeamService } from '../services/userteam.service';
import { UserTeamController } from '../controllers/userteam.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserTeam])],
  controllers: [UserTeamController],
  providers: [UserTeamService],
  exports: [UserTeamService],
})
export class UserTeamModule {}
