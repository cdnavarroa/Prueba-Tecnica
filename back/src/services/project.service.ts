import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '../models/project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  async findAll() {
    return this.projectModel.findAll();
  }

  async findOne(id: number) {
    return this.projectModel.findByPk(id);
  }

  async create(data: any) {
    return this.projectModel.create(data);
  }

  async update(id: number, data: any) {
    const project = await this.projectModel.findByPk(id);
    if (!project) return null;
    return project.update(data);
  }

  async remove(id: number) {
    const project = await this.projectModel.findByPk(id);
    if (!project) return null;
    await project.destroy();
    return true;
  }
}
