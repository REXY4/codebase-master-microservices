const User = require('./user');

const name = 'Room';
const template = {
  name: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    required: true,
  },
  creator: { ...User.template },
  resolvers: [
    { ...User.template }
  ],
  numOfUser: {
    type: Number,
    required: true,
  },
}

module.exports = { name, template, }
