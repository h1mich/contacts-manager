const _ = require('lodash');
const authenticated = require('./middlewares/authenticated.js');

global.app.post('/api/dummies', authenticated, (req, res) => {
  if (req.user.hasDummies) return res.send('already-have-dummies');

  _.each(global.config.dummies, dummy => {
    dummy = _.clone(dummy);
    dummy.id = _.isEmpty(req.user.contacts) ? 0 : _.last(req.user.contacts).id + 1;
    req.user.contacts.push(dummy);
  });
  req.user.hasDummies = true;
  res.send(req.user.contacts);
});
