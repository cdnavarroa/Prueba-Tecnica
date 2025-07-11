import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Team } from '../models/team.model';
import { TeamService } from '../services/team.service';
import { TeamController } from '../controllers/team.controller';

@Module({
  imports: [SequelizeModule.forFeature([Team])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
