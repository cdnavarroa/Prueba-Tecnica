import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { TaskController } from '../controllers/task.controller';
import { Comment } from '../models/comment.model';

@Module({
  imports: [SequelizeModule.forFeature([Task, Comment])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
