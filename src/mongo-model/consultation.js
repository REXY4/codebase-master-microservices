const Topic = require('./topic');
const Room = require('./room');

const name = 'Consultation';
const template = {
  topic: { ...Topic.template },
  room: { ...Room.template },
}

module.exports = { name, template, }
