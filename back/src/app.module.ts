import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { ProjectModule } from './modules/project.module';
import { TaskModule } from './modules/task.module';
import { CommentModule } from './modules/comment.module';
import { TeamModule } from './modules/team.module';
import { UserTeamsModule } from './modules/userteams.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Project } from './models/project.model';
import { Task } from './models/task.model';
import { Comment } from './models/comment.model';
import { Team } from './models/team.model';
import { UserTeam } from './models/userteam.model';
import * as dotenv from 'dotenv';
import { APP_GUARD } from '@nestjs/core';


dotenv.config();

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [User, Project, Task, Comment, Team, UserTeam],
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    CommentModule,
    TeamModule,
    UserTeamsModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
