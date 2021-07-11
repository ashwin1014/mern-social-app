import mongoose from 'mongoose';
import chalk from 'chalk';

const { MONGO_URL } = process.env;

const connectDB = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  });
  console.log(chalk.blue('Mondo DB Connected successfully'));
};

export default connectDB;
