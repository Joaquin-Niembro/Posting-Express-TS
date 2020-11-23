import { createConnection } from 'typeorm';
import { config } from 'dotenv';
config();
import {Comment,Post} from './entity'
export const connection = async (): Promise<void> => {
	const con = createConnection({
		type: 'postgres',
		host: process.env.DB_HOST,
		port: 5432,
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB,
		synchronize: true,
		logging: false,
		entities: [Post, Comment],
	});
	if (con) {
		console.log('DB CONNECTED!');
	} else {
		console.log('DB FAILED CONNECTION');
	}
};
