const Mongoose = require('mongoose');
const { utcNow } = require('../../utils/timezone');
const collections = require('../../config/mongoCollections');

const { Schema } = Mongoose;

const additionalField = {
  createdAt: {
    type: Date,
    required: true,
    default: utcNow,
  },
  updatedBy: { type: String },
  updatedAt: { type: Date },
  deletedBy: { type: String },
  deletedAt: { type: Date },
  notes: { type: String }
}

// const fs = require('fs');
// const schemaOnly = name => (name.indexOf('.js') === name.length - 3) && (['index.js', 'init-models.js'].indexOf(name) === -1);
// const schemas = fs.readdirSync(__dirname).filter(schemaOnly).map(name => require(`./${name}`));
const schemas = collections.map(name => require(`./${name}`));
const initModels = (mongoose) => schemas.reduce((all, schema) => {
  if (!mongoose.models[schema.name]) {
    return {
      ...all,
      [schema.name]: mongoose.model(
        schema.name,
        new Schema({ ...schema.template, ...additionalField })
      )
    }
  }
  return false;
}, {})

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
