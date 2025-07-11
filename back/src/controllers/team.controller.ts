import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TeamService } from '../services/team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.teamService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.teamService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(Number(id));
  }

  @Get(':id/users')
  async getTeamUsers(@Param('id') id: string) {
    return this.teamService.getTeamUsers(Number(id));
  }
}
