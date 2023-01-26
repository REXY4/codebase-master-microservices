const fs = require('fs');

const jsOnlyFilter = name => (name.indexOf('.js') === name.length - 3) && (['index.js', 'all.js'].indexOf(name) === -1);
const toCamelCase = name => name.split(/-|_|\.js/g).map((word, i) => {
  if (i && word.length) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
  return word
}).join('')
const files = fs.readdirSync(__dirname).filter(jsOnlyFilter);

const register = (connection) => {
  const obj = {};
  files.forEach(file => {
    obj[toCamelCase(file)] = require(`./${file}`).default(connection)
  })
  return obj
}

module.exports = register
