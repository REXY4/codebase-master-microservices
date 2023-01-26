const { utcNow } = require('../../utils/timezone');

const name = 'Message';
const template = {
  date: {
    type: Date,
    required: true,
    default: utcNow,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  variables: [
    {
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      }
    }
  ]
}

module.exports = { name, template, }
