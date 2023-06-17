const { Router } = require('express');
const router = Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");
const UserModel = require('../../models/user');
const adminRoute = require('../../utils/adminRoute');

/**
 * @openapi
 * /api/v2/authentication/check:
 *   get:
 *     name: Check
 *     security:
 *       - bearerAuth: []
 *     description: Get a user's authentication status
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the users email and their auth token if the passwords match
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/check',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    response.status(200).send('Authorized');
  }
);

/**
 * @openapi
 * /api/v2/authentication/resetPassword/getCode/{userId}:
 *   get:
 *     name: Reset Password
 *     security:
 *       - bearerAuth: []
 *     description: Reset the user with the ids password
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique code for password reset
 *     responses:
 *       200:
 *         description: Returns the unique code the user needs to change their password.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/resetPassword/getCode/:userId',
  passport.authenticate('jwt', { session: false }),
  adminRoute,
  async (request, response) => {
    const userId = request.params.userId;

    try {
      const uniqueCode = Math.random().toString().substring(2, 6);

      if (!fs.existsSync(path.join(process.cwd(), 'temp')))
        fs.mkdirSync(path.join(process.cwd(), 'temp'));

      fs.writeFileSync(
        path.join(process.cwd(), 'temp', uniqueCode + '.pwrs'),
        userId
      );

      return response.status(200).json({ userId, uniqueCode });
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to create unique password reset code for user.',
        reason: error,
      });
    }
  }
);

/**
 * @openapi
 * /api/v2/authentication/resetPassword/codeVerification/{uniqueCode}:
 *   get:
 *     name: Reset Password Verification
 *     security:
 *       - bearerAuth: []
 *     description: Reset the user with the ids password verification
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: uniqueCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique code for password reset
 *     responses:
 *       200:
 *         description: Returns the unique code the user needs to change their password.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/resetPassword/codeVerification/:uniqueCode',
  async (request, response) => {
    const uniqueCode = request.params.uniqueCode;

    try {
      if (
        !fs.existsSync(path.join(process.cwd(), 'temp', uniqueCode + '.pwrs'))
      )
        return response.status(401).send('Unauthorized');
      else return response.status(200).send('Ok');
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to create unique password reset code for user.',
        reason: error,
      });
    }
  }
);

/**
 * @openapi
 * /api/v2/authentication/resetPassword/final/{uniqueCode}:
 *   get:
 *     name: Reset Password Verification
 *     security:
 *       - bearerAuth: []
 *     description: Reset the user with the ids password verification
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: uniqueCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique code for password reset
 *     responses:
 *       200:
 *         description: Returns the unique code the user needs to change their password.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/resetPassword/final/:uniqueCode', async (request, response) => {
  const uniqueCode = request.params.uniqueCode;
  const body = request.body;

  try {
    if (!fs.existsSync(path.join(process.cwd(), 'temp', uniqueCode + '.pwrs')))
      return response.status(401).send('Unauthorized');

    const userId = fs.readFileSync(
      path.join(process.cwd(), 'temp', uniqueCode + '.pwrs')
    );

    await UserModel.updateOne(
      { _id: { $eq: userId } },
      { password: bcrypt.hashSync(body.password, 2048) }
    );

    fs.unlinkSync(path.join(process.cwd(), 'temp', uniqueCode + '.pwrs'));

    return response.status(200).send('Ok');
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to create unique password reset code for user.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/authentication/login:
 *   post:
 *     name: Login
 *     description: Authenticate a user
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 description: The user's email
 *                 type: string
 *               password:
 *                 description: The user's password
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the users email and their auth token if the passwords match
 *       404:
 *         description: User not found
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/login', async (request, response) => {
  let { body } = request;

  try {
    let privateKey = fs.readFileSync(process.cwd() + '/certs/privateKey.pem', {
      encoding: 'utf-8',
    });

    const found = await UserModel.findOne({ email: body.email });

    if (!found)
      return response
        .status(404)
        .json({ message: 'User not found, please register them.' });
    else {
      let data = found.toJSON();

      if (data.email === 'admin@purposeapp') data.type = 'admin';

      if (bcrypt.compareSync(body.password, data.password)) {
        let token = jwt.sign(
          {
            sub: data.email,
          },
          privateKey,
          { expiresIn: '1d', algorithm: 'RS256' }
        );

        return response.status(200).json({
          message: 'Successfully logged in.',
          user: {
            ...data,
            password: undefined,
          },
          token,
        });
      } else
        return response.status(200).json({
          message: 'Incorrect password.',
          error: 'invalid-password',
        });
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to authenticate user.',
      reason: error,
      error: 'E00001',
    });
  }
});

/**
 * @openapi
 * /api/v2/authentication/register:
 *   post:
 *     name: Register
 *     description: Create a user
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 description: The user's email
 *                 type: string
 *               password:
 *                 description: The user's password
 *                 type: string
 *               agreedToTerms:
 *                 description: The user agreed to the terms
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Returns the users email and their auth token if the user is created
 *       500:
 *         description: Failure because the email is already in use or failure returns the message, reason and error code
 */
router.post('/register', async (request, response) => {
  const { body } = request;

  if (!body.agreedToTerms)
    return response.status(200).json({
      message: 'You need to agree to terms before creating an account.',
      error: 'failed-to-agree-to-terms',
    });

  try {
    const privateKey = fs.readFileSync('certs/privateKey.pem', {
      encoding: 'utf-8',
    });

    const tdata = {
      email: body.email,
      password: bcrypt.hashSync(body.password, 2048),
      agreedToTerms: body.agreedToTerms,
      userGroup: body.userGroup
    };

    const token = jwt.sign(
      {
        sub: tdata.email,
      },
      privateKey,
      { expiresIn: '1d', algorithm: 'RS256' }
    );

    const found = await UserModel.findOne({ email: tdata.email });

    if (found)
      return response.status(500).json({
        message: 'Email already in use. Please use a different email.',
      });
    else {
      const newUser = new UserModel({
        email: tdata.email,
        password: tdata.password,
        agreedToTerms: tdata.agreedToTerms,
        completedProfile: false,
        userGroup: tdata.userGroup,
      });

      newUser.save();

      const data = newUser.toJSON();

      response.status(200).json({
        message: 'Successfully registered new user.',
        user: {
          ...data,
          password: undefined,
        },
        token,
      });
    }
  } catch (error) {
    console.log(error);

    return response.status(500).json({
      message: 'Error while registering a new user.',
      reason: error,
      error: 'E00002',
    });
  }
});

module.exports = router;
