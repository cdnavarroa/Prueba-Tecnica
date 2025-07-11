import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';
import { Team } from '../models/team.model';
import { Comment } from '../models/comment.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll() {
    return this.userModel.findAll();
  }

  async findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  async create(data: any) {
    return this.userModel.create(data);
  }

  async update(id: number, data: any) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }
  // Devuelve los últimos 5 comentarios de tareas donde el usuario está asignado (como userId o teamId)
  async getRecentCommentsForUser(userId: number) {
    const { Op } = require('sequelize');
    const UserTeam = require('../models/userteam.model').UserTeam;
    const Team = require('../models/team.model').Team;
    // 1. Obtener los equipos a los que pertenece el usuario
    const userTeams = await UserTeam.findAll({ where: { userId: { [Op.ne]: userId } } });
    // Consultar los teamIds directamente desde la base de datos (userTeams ya es resultado de la consulta)
    const teamIds = await UserTeam.findAll({
      where: { userId },
      attributes: ['teamId'],
      raw: true,
    }).then((rows: any[]) => rows.map(r => r.teamId));


    

    console.log('UserTeams:', userTeams);

    console.log('TeamIds:', teamIds);
    // 2. Buscar todas las tareas donde:
    //    - userId = usuario (puede ser null en tareas de equipo)
    //    - teamId IN (equipos del usuario) (puede ser null en tareas de usuario)
    let taskWhere = {};
    if (teamIds.length > 0) {
      taskWhere = {
        [Op.or]: [
          { userId },
          { teamId: { [Op.in]: teamIds } }
        ]
      };
    } else {
      // Solo tareas individuales, no de equipo
      taskWhere = { userId, teamId: null };
    }
    // Traer userId y teamId de cada tarea
    const tasks = await Task.findAll({
      where: taskWhere,
      attributes: ['id', 'userId', 'teamId'],
    });
    if (tasks.length === 0) return [];

    // 3. Buscar todos los comentarios de esas tareas (excepto los del propio usuario)
    const taskIds = tasks.map(t => t.id);
    const comments = await Comment.findAll({
      where: {
        taskId: { [Op.in]: taskIds },
        userId: { [Op.ne]: userId },
      },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
    });

    // 4. Buscar todos los usuarios y equipos relacionados
    const allUserIds = Array.from(new Set(comments.map(c => c.userId)));
    const allTeamIds = Array.from(new Set(tasks.map(t => t.teamId).filter(Boolean)));
    const users = await User.findAll({ where: { id: { [Op.in]: allUserIds } }, attributes: ['id', 'name', 'email'] });
    const teams = allTeamIds.length > 0 ? await Team.findAll({ where: { id: { [Op.in]: allTeamIds } }, attributes: ['id', 'name'] }) : [];

    // 5. Mapear comentarios con información de usuario y equipo
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));
    const teamMap = Object.fromEntries(teams.map(t => [t.id, t]));

    // 6. Enriquecer cada comentario con información cruzada de usuario, equipo y tarea
    const taskMap = Object.fromEntries(tasks.map(t => [t.id, t]));
    const result = comments.slice(0, 5).map((c) => {
      const task = taskMap[c.taskId];
      const teamId = task?.teamId ?? null;
      const user = userMap[c.userId] || c.user || {};
      const team = teamId && teamMap[teamId] ? teamMap[teamId] : null;
      return {
        id: c.id,
        text: c.content,
        createdAt: c.createdAt,
        userId: c.userId,
        userName: user.name || user.email || '-',
        userEmail: user.email || '-',
        taskId: c.taskId,
        taskTitle: task?.title || '-',
        taskStatus: task?.status || '-',
        teamId,
        teamName: team ? team.name : null,
        projectId: task?.projectId || null,
      };
    });

    return result;
  }
}
