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

/*
 * API ENDPOINTS
*/

app.get('/', (_req, res) => res.status(200).send('Hello'));

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
