const _ = require('lodash');

global.app.post('/api/register', (req, res) => {
  if (!new RegExp(global.config.usernameFormat).test(req.body.username)) return res.status(500).send('invalid-username');
  if (!new RegExp(global.config.passwordFormat).test(req.body.password)) return res.status(500).send('invalid-password');

  var usernameTaken = _.some(global.gs.users, { username: req.body.username });

  // This error isn't 500 because it is part of the correct logic.
  if (usernameTaken) return res.send('username-taken-error');

  var user = {
    id: _.size(global.gs.users) + 1,
    username: req.body.username,
    password: req.body.password,
    contacts: [],
    hasDummies: false
  };

  global.gs.users.push(user);
  res.send(user);
});