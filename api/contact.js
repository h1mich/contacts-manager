const _ = require('lodash');
const moment = require('moment');
const authenticated = require('./middlewares/authenticated');

global.app.delete('/api/contact', authenticated, (req, res) => {
  // Check on !req.body.id returns true on id == 0
  // that's why exactly type of the parameter is checked.
  if (typeof req.body.id !== 'number') return res.status(500).send('invalid-id-error');

  var contact = _.find(req.user.contacts, { id: req.body.id });
  // The contact might not be found if the user opened the site in two separate tabs,
  // deleted the contact in one tab and now tries to delete the same contact in the first tab.
  if (!contact) res.send('contact-not-found');
  else {
    req.user.contacts = _.reject(req.user.contacts, { id: req.body.id });
    res.send('success');
  }
});

global.app.post('/api/contact', authenticated, (req, res) => {
  if (!new RegExp(global.config.nameFormat).test(req.body.name)) return res.status(500).send('invalid-name');
  if (!new RegExp(global.config.phoneFormat).test(req.body.phone)) return res.status(500).send('invalid-phone');

  req.user.contacts.push({
    id: _.isEmpty(req.user.contacts) ? 0 : _.last(req.user.contacts).id + 1,
    name: req.body.name,
    phone: req.body.phone,
    comment: req.body.comment,
    date: moment().valueOf()
  });
  res.send(_.last(req.user.contacts));
});

global.app.put('/api/contact', authenticated, (req, res) => {
  // Check on !req.body.id returns true on id == 0
  // that's why exactly type of the parameter is checked.
  if (typeof req.body.id !== 'number') return res.status(500).send('empty-id-error');
  if (!new RegExp(global.config.nameFormat).test(req.body.name)) return res.status(500).send('invalid-name');
  if (!new RegExp(global.config.phoneFormat).test(req.body.phone)) return res.status(500).send('invalid-phone');

  var contact = _.find(req.user.contacts, { id: req.body.id });
  // The contact might not be found if the user opened the site in two separate tabs,
  // deleted the contact in one tab and now tries to delete the same contact in the first tab.
  if (!contact) res.send('contact-not-found');
  else {
    contact.phone = req.body.phone;
    contact.name = req.body.name;
    contact.comment = req.body.comment;
    res.send(contact);
  }
});
