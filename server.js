import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import morgan from 'morgan';
// import { createClient } from 'redis';

import { registerAuthentication } from './controllers/register.js';
import { signinAuthentication, handleSignout } from './controllers/auth.js';
import {
  handleProfileGet,
  handleProfileUpdate,
} from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';
import * as auth from './controllers/authorization.js';

/* const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'test',
    database: 'smart-brain',
    ssl: {
      rejectUnauthorized: false, // for Heroku server only
    },
  },
}); */

const db = knex({
  client: 'pg',
  connection: {
    // connectionString: 'postgres://postgres:test@localhost:5432/smart-brain', //process.env.DATABASE_URL,
    connectionString: process.env.POSTGRES_URI,
  },
});

// // setup redis client
// // Note: Ensure you have redis server running and the 'redis' package installed
// const redisClient = createClient({ url: process.env.REDIS_URI });

// redisClient.on('error', (err) => console.log('Redis Client Error', err));

// await redisClient.connect();

// console.log('redisClient 1', redisClient);

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('Welcome to Smart-brain app');
});

app.post('/signin', signinAuthentication(db, bcrypt));
app.post('/signout', handleSignout);
app.post('/register', registerAuthentication(db, bcrypt));
app.get('/profile/:id', auth.requireAuth, (req, res) =>
  handleProfileGet(req, res, db)
);
app.post('/profile/:id', auth.requireAuth, (req, res) =>
  handleProfileUpdate(req, res, db)
);
app.put('/image', auth.requireAuth, (req, res) => handleImage(req, res, db));
app.post('/imageurl', auth.requireAuth, (req, res) => handleApiCall(req, res));

app.listen(process.env.PORT || 3001, () => {
  console.log(`App is running on port ${process.env.PORT || 3001}`);
});

/* 
1. Understand requirement
2. Plan step:
/ --> res is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
3. Divide tasks into smaller
4. Code and debug
*/
