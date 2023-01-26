const fs = require('fs');

const jsOnlyFilter = name => (name.indexOf('.js') === name.length - 3) && (['index.js', 'all.js'].indexOf(name) === -1);
const toCamelCase = name => name.split(/-|_|\.js/g).map((word, i) => {
  if (i && word.length) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
  return word
}).join('')
const files = fs.readdirSync(__dirname).filter(jsOnlyFilter);

files.forEach(name => {
  const camelFileName = toCamelCase(name)
  const methods = require(`./${name}`)

  exports[camelFileName] = {}
  Object.entries(methods).forEach(([key, value]) => {
    if (key !== 'default') {
      exports[camelFileName][key] = value
    }
  })
})
