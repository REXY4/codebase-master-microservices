const code = require('./code');

const Language = {
  id: require('./indonesia'),
  en: require('./english'),
}

const Message = {};
Object.keys(code).forEach((key) => {
  Message[key] = Message[key] || { _: code[key] };
  Object.keys(Language).forEach((lang) => {
    Message[key][lang] = Language[lang][key]
  })
})

exports.Language = Language;
exports.Message = Message;
exports.langs = Object.keys(Language);
exports.get = (key, lang, params = []) => ({
  code: Message[key]._,
  message: typeof Message[key][lang] === 'function' ? Message[key][lang].apply(Message[key][lang], params) : Message[key][lang]
})
