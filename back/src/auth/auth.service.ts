import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { stat } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const { email, password, name, role } = data;
    const existing = await this.userModel.findOne({ where: { email } });
    if (existing) return { error: 'El usuario ya existe', status: 400 };
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ email, password: hash, name, role } as any);
    return { message: 'Usuario registrado', status: 200,  user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async login(data: any) {
    const { email, password } = data;

    console.log('Login attempt with data:', data);

    const user = await this.userModel.findOne({ where: { email } });

    console.log('User found:', user?.password);

    if (!user) return { error: 'Usuario no encontrado' };
    if (!password || !user.password) return { error: 'Credenciales inválidas' };
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { error: 'Contraseña incorrecta' };
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { message: 'Login exitoso', token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async forgotPassword(data: any) {
    // Aquí deberías enviar un email real con un token de recuperación
    return { message: 'Email de recuperación enviado (mock)' };
  }

  async resetPassword(data: any) {
    // Aquí deberías validar el token y actualizar la contraseña
    return { message: 'Contraseña restablecida (mock)' };
  }
}
