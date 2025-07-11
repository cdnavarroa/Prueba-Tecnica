import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../models/comment.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private commentModel: typeof Comment,
  ) {}

  async findAll() {
    return this.commentModel.findAll();
  }

  async findOne(id: number) {
    return this.commentModel.findByPk(id);
  }

  async create(data: any) {
    return this.commentModel.create(data);
  }

  async update(id: number, data: any) {
    const comment = await this.commentModel.findByPk(id);
    if (!comment) return null;
    return comment.update(data);
  }

  async remove(id: number) {
    const comment = await this.commentModel.findByPk(id);
    if (!comment) return null;
    await comment.destroy();
    return true;
  }
}
