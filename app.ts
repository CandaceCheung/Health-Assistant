import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import dontenv from 'dotenv';
import Knex from 'knex';

dontenv.config();

const knexConfig = require('./knexfile');
const configMode = process.env.NODE_ENV || 'development';
export const knex = Knex(knexConfig[configMode]);


const app = express();

const sessionMiddleware = expressSession({
	secret: process.env.SESSION_SECRET || '',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false, httpOnly: true }
});

declare module 'express-session' {
	interface SessionData {
		user?: number;
	}
}

app.use(express.json(), sessionMiddleware, express.static('public'));


app.use((req, res) => {
	res.status(404).sendFile(path.resolve('./public/404.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
