import { App } from './app';

const main = async (): Promise<void> => {
	const app = new App(5000);
	await app.listen();
};

main();
