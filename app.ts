import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import dontenv from 'dotenv';
import Knex from 'knex';
import { infoRoutes } from './routes/infoRoutes';
import { testRoutes } from './routes/testRoutes';
<<<<<<< HEAD
// import { testRoutes2 } from './routes/testRoutes2';
=======
>>>>>>> 0088317c33a1e9f07768fc05a0802f598e009124

dontenv.config();

const knexConfig = require('./knexfile');
const configMode = process.env.NODE_ENV || 'development';
export const knex = Knex(knexConfig[configMode]);
const app = express();

const sessionMiddleware = expressSession({
	secret: process.env.SESSION_SECRET || '',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false, httpOnly: true, maxAge: 2.628e+9 }
});

app.use(cookieParser(), express.json(), sessionMiddleware, express.static('public'));
app.use('/info', infoRoutes);
app.use('/test', testRoutes)

app.use((req, res) => {
	res.status(404).sendFile(path.resolve('./public/404.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
