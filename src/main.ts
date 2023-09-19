import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './users/users.controller.interface';
import { UserService } from './users/users.service';
import { IUserService } from './users/users.service.interface';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';

interface IBootstrap {
	appContainer: Container;
	app: App;
}
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrap {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
