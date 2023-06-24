const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => console.log(err));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//import data into Db
const importData = async () => {
  try {
    Promise.all([
      await Tour.create(tours),
      await User.create(users, { validateBeforeSave: false }),
      await Review.create(reviews),
    ]);
  } catch (error) {
    console.log(error);
  }
};

//delete all data from Db
const deleteData = async () => {
  try {
    Promise.all([
      await Tour.deleteMany(),
      await User.deleteMany(),
      await Review.deleteMany(),
    ]);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  (async () => {
    await importData();
    process.exit();
  })();
} else if (process.argv[2] === '--delete') {
  (async () => {
    await deleteData();
    process.exit();
  })();
}
