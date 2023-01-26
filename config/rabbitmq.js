require('dotenv').config()

module.exports = {
  port: process.env.RABBIT_MQ_PORT || 5672,
  host: process.env.RABBIT_MQ_HOST || 'localhost',
  user: process.env.RABBIT_MQ_USER || 'guest',
  password: process.env.RABBIT_MQ_PASSWORD || 'guest',
  queue: {
    Enum: {
      exchange: {
        name: 'enumeration',
        type: 'topic',
        options: {
          durable: true
        }
      },
      route: 'enumeration',
      // For service cluster which mean "be-ms-this" has multiple instances
      // Scenario 1: You should add more prefix if you need every instance of subscription/consumer receive the message
      // Scenario 2: Don't add more prefix if your service cluster just want to receive one only from many (of same instance)
      queue: 'be-master:enumeration'
    },
    RoleResource: {
      exchange: {
        name: 'role-resource',
        type: 'topic',
        options: {
          durable: true
        }
      },
      route: 'role-resource',
      queue: 'be-master:role-resource'
    }
  }
};
