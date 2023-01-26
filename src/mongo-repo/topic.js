let mongoose;

async function getOneBy(options) {
  const criteria = {
    ...options,
    where: {
      ...options.where
    },
  };
  return mongoose.models.Topic.findOne(criteria);
}

async function create(data) {
  const newData = new mongoose.models.Topic(data);
  return newData.save();
}

async function updateBy(options, data) {
  const criteria = {
    ...options,
    ...data
  };

  return mongoose.models.Topic.updateOne(criteria);
}

async function removeBy(options) {
  const criteria = {
    ...options,
    where: {
      ...options.where,
    },
  };

  return mongoose.models.Topic.deleteOne(criteria);
}

const registers = {
  getOneBy, create, updateBy, removeBy
};

exports.default = (connection) => {
  mongoose = connection;
  return registers;
};

Object.values(registers).forEach((method) => {
  exports[method.name] = async function (...args) {
    const [connection] = args;
    mongoose = connection;
    return method(...args.slice(1));
  };
});
