const Strategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const UserModel = require("../models/user");

const pubKey = fs.readFileSync('certs/publicKey.pem', {
  encoding: 'utf8',
});

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: pubKey,
  algorithms: ['RS256'],
};

module.exports = new Strategy(options, async (payload, done) => {
  const found = await UserModel.findOne({ email: payload.sub });

  if (!found) return done('Unauthorized', null);
  else return done(null, found.toJSON());
});
