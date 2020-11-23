import express, { Application } from 'express';
import { connection } from './database';
import { AppRouter } from './AppRouter';
import './Controllers/PostController'
import './Controllers/CommentsController'
export class App {
	app: Application;
	PORT: number | string;
	constructor(port: number) {
		this.app = express();
		this.PORT = process.env.PORT || port || 5000;
		this.middlewares();
		this.database();
		this.routes();
	}
	middlewares(): void {
		this.app.use(express.json());
	}
	database(): void {
		connection();
	}
	routes(): void {
		this.app.use(AppRouter.getInstance());
	}
	async listen(): Promise<void> {
		await this.app.listen(this.PORT);
		console.log(`server on port ${this.PORT}`);
	}
}
