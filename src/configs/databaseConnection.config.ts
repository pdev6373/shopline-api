import { connect } from 'mongoose';

const databaseConnection = async () => {
  try {
    await connect(process.env.DATABASE_URI!);
  } catch (err) {
    console.error(err);
  }
};

export default databaseConnection;
