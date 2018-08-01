const _ = require('lodash');

global.app.post('/api/login', (req, res) => {
  var user = _.find(global.gs.users, { username: req.body.username, password: req.body.password });
  if (!user) return res.send('credentials-error');
  res.send({
    username: user.username,
    password: user.password,
    hasDummies: user.hasDummies,
    contacts: user.contacts
  });
});