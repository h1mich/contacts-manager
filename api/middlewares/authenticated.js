const _ = require('lodash');

// This middleware should be used on all apis that require
// the user to be authenticated.
module.exports = (req, res, next) => {
  // The credentials aren't stored in the cookies because when the user doesn't want
  // his session to be remembered credentials are stored in memory on the client side.
  var username = req.body.username;
  var password = req.body.password;

  let user = _.find(global.gs.users, { username, password });
  if (!user) res.status(500).send('credentials-error');
  else {
    req.user = user;
    next();
  }
};