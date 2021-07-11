/* eslint-disable no-console */
// import dotEnv from 'dotenv';
import express from 'express';
import chalk from 'chalk';
import helmet from 'helmet';
import morgan from 'morgan';
import Cors from 'cors';
// eslint-disable-next-line import/no-extraneous-dependencies
import compression from 'compression';

// local imports
import connectDB from './config/db';
import HttpError from './models/http-error';
import userRoute from './routes/users';
import authRoute from './routes/auth';

/*
 * APP CONFIG
*/
// dotEnv.config();

const app = express();
const port = process.env.PORT || 8001;

/*
 * MIDDLEWARE
*/
app.use(express.json());
app.use(Cors());
app.use(helmet());
app.use(morgan('common'));
app.use(compression());

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

// handle route not found
app.use(() => {
  const error = new HttpError('Route not found', 404);
  throw error;
});

/*
 * DB CONNECT
*/
connectDB();

/*
 * LISTENER
*/
const server = app.listen(port, () => console.log(chalk.blue(`Listening on localhost: ${port}`)));

// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err, promise) => {
  console.log(chalk.red(`Connection Error: ${err}`));
  server.close(() => process.exit(1));
});
