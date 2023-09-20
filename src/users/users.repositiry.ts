import { inject, injectable } from 'inversify';
import { User } from './user.entity';
import { IUserRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { TYPES } from '../types';
import { PrismaService } from '../../database/prisma.service';

@injectable()
export class UsersRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}
	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
