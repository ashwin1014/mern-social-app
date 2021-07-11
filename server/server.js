/* eslint-disable no-console */
import dotEnv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import helmet from 'helmet';
import morgan from 'morgan';
import Cors from 'cors';
// eslint-disable-next-line import/no-extraneous-dependencies
import compression from 'compression';

// local imports
import HttpError from './models/http-error';
import userRoute from './routes/users';
import authRoute from './routes/auth';

/*
 * APP CONFIG
*/
dotEnv.config();

const app = express();
const port = process.env.PORT || 8001;
const { MONGO_URL } = process.env;

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
 * DB CONFIG
*/
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}, () => {
  console.log(chalk.blue('Mondo DB Connected successfully'));
});

/*
 * LISTENER
*/
app.listen(port, () => console.log(chalk.blue(`Listening on localhost: ${port}`)));
