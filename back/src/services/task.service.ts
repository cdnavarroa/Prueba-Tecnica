import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../models/task.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async findAll() {
    return this.taskModel.findAll();
  }

  async findOne(id: number) {
    return this.taskModel.findByPk(id);
  }


  async create(data: any) {
    // Validaciones básicas
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      throw new BadRequestException('El título es obligatorio');
    }
    if (!data.status || !['todo', 'in_progress', 'done'].includes(data.status)) {
      throw new BadRequestException('El estado es inválido');
    }
    if (!data.projectId) {
      throw new BadRequestException('El proyecto es obligatorio');
    }
    if (!data.userId && !data.teamId) {
      throw new BadRequestException('Debe asignar la tarea a un usuario o equipo');
    }
    if (data.userId && data.teamId) {
      throw new BadRequestException('Solo puede asignar la tarea a un usuario o a un equipo, no ambos');
    }
    if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
      throw new BadRequestException('La fecha límite es inválida');
    }
    return this.taskModel.create(data);
  }

  async update(id: number, data: any) {
    const task = await this.taskModel.findByPk(id);
    if (!task) throw new NotFoundException('Tarea no encontrada');
    // Validaciones para update (solo si se envía el campo)
    if (data.title !== undefined && (!data.title || typeof data.title !== 'string' || !data.title.trim())) {
      throw new BadRequestException('El título es obligatorio');
    }
    if (data.status !== undefined && !['todo', 'in_progress', 'done'].includes(data.status)) {
      throw new BadRequestException('El estado es inválido');
    }
    if (data.dueDate !== undefined && data.dueDate && isNaN(Date.parse(data.dueDate))) {
      throw new BadRequestException('La fecha límite es inválida');
    }
    if (data.userId && data.teamId) {
      throw new BadRequestException('Solo puede asignar la tarea a un usuario o a un equipo, no ambos');
    }
    return task.update(data);
  }

  async remove(id: number) {
    const task = await this.taskModel.findByPk(id);
    if (!task) return null;
    await task.destroy();
    return true;
  }
}
