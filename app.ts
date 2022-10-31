import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import dontenv from 'dotenv';
import grant from 'grant';
import Knex from 'knex';
import { isLoggedIn } from './util/guard';

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

const grantExpress = grant.express({
	defaults: {
		origin: 'https://localhost:8080',
		transport: 'session',
		state: true
	},
	google: {
		key: process.env.GOOGLE_CLIENT_ID || '',
		secret: process.env.GOOGLE_CLIENT_SECRET || '',
		scope: ['profile', 'email'],
		callback: '/login/google'
	}
});

app.use(express.json(), sessionMiddleware, express.static('public'), grantExpress as express.RequestHandler);
app.use(isLoggedIn, express.static('private'));


app.use((req, res) => {
	res.status(404).sendFile(path.resolve('./public/404.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
