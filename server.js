/* const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleProfileGet } = require('./controllers/profile');
const { handleImage, handleApiCall } = require('./controllers/image');
 */
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';

/* const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    // port: 5432,
    user: 'postgres',
    password: 'test',
    database: 'smart-brain',
  },
}); */

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('Welcome to Smart-brain app');
});

app.post('/signin', handleSignin(db, bcrypt));
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/imageurl', (req, res) => handleApiCall(req, res));

app.listen(process.env.PORT || 3001, () => {
  console.log(`App is running on port ${process.env.PORT}`);
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
