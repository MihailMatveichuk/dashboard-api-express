import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { UserService } from './users.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();

let confgService: IConfigService;
let usersRepository: IUserRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	confgService = container.get<IConfigService>(TYPES.IConfigService);
	usersRepository = container.get<IUserRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.IUserService);
});

let createdUser: UserModel | null;

describe('User service', () => {
	it('create User', async () => {
		confgService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'a@a.ru',
			name: 'Mikle',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validate User - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({
			email: 'a@a.ru',
			password: '1',
		});
		expect(result).toBeTruthy();
	});
	it('validate User - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(result).toBeFalsy();
	});
	it('validate User - wrong user ', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(result).toBeFalsy();
	});
});
