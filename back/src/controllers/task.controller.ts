  // Obtener comentarios de una tarea (opcionalmente filtrados por usuario)
  
import { Controller, Get, Post, Put, Delete, Param, Body, Inject, Req } from '@nestjs/common';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { TaskService } from '../services/task.service';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @InjectModel(Comment) private commentModel: typeof Comment
  ) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.taskService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.taskService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(Number(id));
  }

  // Obtener comentarios de una tarea (opcionalmente filtrados por usuario)
  @Get(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Req() req: Request
  ) {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    const where: any = { taskId: Number(id) };
    if (userId) where.userId = userId;
    const comments = await this.commentModel.findAll({
      where,
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    if (!comments || comments.length === 0) {
      return [];
    }

    return comments.map(c => ({
      id: c.id,
      text: c.content,
      content: c.content,
      createdAt: c.createdAt,
      userId: c.userId,
      userName: c.user && (c.user.name || c.user.get?.('name')),
      userEmail: c.user && (c.user.email || c.user.get?.('email'))
    }));
  }

  // Crear comentario en una tarea
  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request
  ) {
  
    const userId = body.userId;
    if (!userId) throw new Error('userId requerido');
    if (!body.text) throw new Error('El texto es obligatorio');
    const comment = await this.commentModel.create({
      content: body.text,
      taskId: Number(id),
      userId: Number(userId),
    } as any);
    return {
      id: comment.id,
      text: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId
    };
  }

}
