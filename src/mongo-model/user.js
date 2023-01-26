const name = 'User';
const template = {
  name: String,
  username: String,
  email: String,
  role: {
    id: String,
    name: String,
  }
}

module.exports = { name, template, }
