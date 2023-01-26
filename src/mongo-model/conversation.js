const Consultation = require('./consultation');
const Message = require('./message');
const User = require('./user');

const name = 'Conversation';
const template = {
  from: { ...User.template },
  consultation: { ...Consultation.template },
  message: { ...Message.template },
}

module.exports = { name, template, }
