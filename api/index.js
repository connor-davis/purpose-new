'use strict';
const dotenv = require('dotenv');

dotenv.config();

/**
 * Utility imports
 */
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const compression = require('compression');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const JwtStrategy = require('./strategies/jwt');
const mongoose = require('mongoose');
const morgan = require('morgan');
const logger = require('./utils/logger');
const passport = require('passport');
const session = require('express-session');
const basicAuth = require('express-basic-auth');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * App/Server imports
 */
const express = require('express');
const app = express();

/**
 * Global Variables
 */
const secure_port = process.env.HTTP_SECURE_PORT || 443;
const port = process.env.HTTP_PORT || 80;
const devmode = process.env.DEV_MODE === 'true';
const client = mongoose.connect(process.env.MONGO_URL, {
  autoIndex: false,
  autoCreate: false,
});
const http = require('http').createServer(app);
let https;
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const UserModel = require('./models/user');

/**
 * Filesystem imports
 */
const fs = require('fs');
const path = require('path');

/**
 * Api imports
 */
const apiRoutes = require('./apiRoutes');

logger.info('Waiting for database connection.');

client.then(async () => {
  logger.success('Mongoose connected to MongoDB.');

  logger.success(`OP MODE: ${devmode ? 'DEV' : 'PROD'}`);

  const adminFound = await UserModel.findOne({ email: 'admin@purposeapp' });

  if (!adminFound) {
    logger.warn('Admin user does not exist, creating them now.');

    const newAdmin = new UserModel({
      personalDetails: {
        firstName: 'Purpose',
        lastName: 'Admin',
      },
      email: 'admin@purposeapp',
      password: bcrypt.hashSync(process.env.ROOT_PASSWORD, 2048),
      agreedToTerms: true,
      completedProfile: true,
      userType: 'admin',
      userGroup: 'PUR1'
    });

    try {
      newAdmin.save();

      logger.success('Created admin user.');
    } catch (error) {
      logger.error(error);
    }
  }

  if (!devmode) {
    https = require('https').createServer(
      {
        cert: fs.readFileSync(
          process.env.SSL_CERTIFICATE_PATH + '/fullchain.pem'
        ),
        key: fs.readFileSync(process.env.SSL_CERTIFICATE_PATH + '/privkey.pem'),
      },
      app
    );
  }

  let options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Api (v2)',
        version: '2.0.0',
      },
    },
    apis: ['./apiRoutes/**/*.js'],
  };

  let openapiSpecification = swaggerJsDoc(options);

  let morganMiddleware = morgan(function (tokens, req, res) {
    // console.log(process.stdout.getWindowSize());

    return [
      chalk.hex('#c7e057').bold(tokens.method(req, res)),
      chalk.hex('#ffffff').bold(tokens.status(req, res)),
      chalk.hex('#262626').bold(tokens.url(req, res)),
      chalk.hex('#c7e057').bold(tokens['response-time'](req, res) + ' ms'),
    ].join('|');
  });

  app.use(morganMiddleware);
  app.use(
    cors({
      origin: [
        'https://purpose360.co.za',
        'https://purposev2.web.app',
        'https://purposev2.firebaseapp.com',
        'https://demo.purpose360.co.za',
        'http://localhost:3000',
      ],
      exposedHeaders: ['Content-Disposition'],
    })
  );
  app.use(compression());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: false }));
  app.use(session({ secret: process.env.ROOT_PASSWORD }));
  app.use(passport.initialize());
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const found = await User.findOne({ _id: id });

    if (found) return done(null, found.toJSON());
    else return done(null, id);
  });

  passport.use('jwt', JwtStrategy);

  app.use('/api/v2', apiRoutes);
  app.use(
    '/api/v2/docs',
    basicAuth({
      users: { admin: process.env.ROOT_PASSWORD },
      challenge: true,
    }),
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
  );

  app.get('/', async (request, response) => {
    response.render('pages/welcome');
  });

  app.get('/**', async (request, response) => {
    response.render('pages/404.ejs');
  });

  http.listen(port, () =>
    logger.success(`HTTP listening on http://localhost:${port}`)
  );

  if (!devmode) {
    https.listen(secure_port, () =>
      logger.success(`HTTPS listening on https://localhost:${secure_port}`)
    );
  }
});
