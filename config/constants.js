const TYPE_INFO = {
  SYSTEM: 'SYSTEM INFO',
  REDIS: 'REDIS INFO',
  SQL: 'SQL INFO',
  MONGODB: 'MONGODB INFO',
  CRON: 'CRON INFO',
  RABBIT_MQ: 'RABBITMQ INFO',
  SOCKET_IO: 'SOCKETIO INFO',
  REST_API: 'REST API INFO',
  SERVICE_V1: 'SERVICE V1 INFO',
  GRPC: 'GRPC INFO',
  GRPC_CLIENT: 'GRPC-CLIENT INFO',
  HTTP_ACCESS: 'HTTP ACCESS INFO',
  HEALTH_CHECK: 'HEALTH CHECK INFO'
}

const TYPE_WARN = {
  SYSTEM: 'SYSTEM WARNING',
  REDIS: 'REDIS WARNING',
  SQL: 'SQL WARNING',
  MONGODB: 'MONGODB WARNING',
  CRON: 'CRON WARNING',
  RABBIT_MQ: 'RABBITMQ WARNING',
  SOCKET_IO: 'SOCKETIO WARNING',
  REST_API: 'REST API WARNING',
  SERVICE_V1: 'SERVICE V1 WARNING',
  GRPC: 'GRPC WARNING',
  GRPC_CLIENT: 'GRPC-CLIENT WARNING',
  HTTP_ACCESS: 'HTTP ACCESS WARNING',
  HEALTH_CHECK: 'HEALTH CHECK WARNING'
}

const TYPE_ERROR = {
  UNCAUGHT: 'UNCAUGHT EXCEPTION',
  SYSTEM: 'SYSTEM ERROR',
  REDIS: 'REDIS ERROR',
  SQL: 'SQL ERROR',
  MONGODB: 'MONGODB ERROR',
  CRON: 'CRON ERROR',
  RABBIT_MQ: 'RABBITMQ ERROR',
  SOCKET_IO: 'SOCKETIO ERROR',
  REST_API: 'REST API ERROR',
  SERVICE_V1: 'SERVICE V1 ERROR',
  GRPC_CLIENT: 'GRPC-CLIENT ERROR',
  HTTP_ACCESS: 'HTTP ACCESS ERROR',
  HEALTH_CHECK: 'HEALTH CHECK ERROR',
  AUTHENTICATION: 'AUTHENTICATION ERROR',
  AUTHORIZATION: 'AUTHORIZATION ERROR'
}

const MESSAGE = {
  /** listening port message */
  HTTP_LISTENED: 'HTTP listening on port',
  GRPC_LISTENED: 'GRPC listening on port',
  SOCKET_IO_LISTENED: 'SocketIO listening on port',

  /** sql message */
  SQL_CONNECTED: 'SQL database connected',
  SQL_DISCONNECTED: 'SQL database disconnected',
  SQL_POOL_CONNECTING: 'SQL pool on connecting',
  SQL_POOL_CONNECTED: 'SQL pool has connected',
  SQL_POOL_RELEASING: 'SQL pool on releasing',
  SQL_POOL_RELEASED: 'SQL pool has released',

  /** mongodb message */
  MONGODB_CONNECTED: 'MongoDB database connected',
  MONGODB_DISCONNECTED: 'MongoDB database disconnected',
  MONGODB_POOL_CONNECTING: 'MongoDB pool on connecting',
  MONGODB_POOL_CONNECTED: 'MongoDB pool has connected',
  MONGODB_POOL_DISCONNECTING: 'MongoDB pool on disconnecting',
  MONGODB_POOL_DISCONNECTED: 'MongoDB pool has disconnected',
  MONGODB_POOL_CLOSED: 'MongoDB pool closed',
  MONGODB_POOL_RECONNECTED: 'MongoDB pool has reconnected',
  MONGODB_POOL_RECONNECT_FAIL: 'MongoDB pool fail to reconnect',
  MONGODB_POOL_ERROR: 'MongoDB pool has error',
  MONGODB_POOL_FULLSETUP: 'MongoDB pool has fullsetup to replica set',
  MONGODB_POOL_ALL_CONNECTED: 'MongoDB pool has connected to all connections',

  /** redis message */
  REDIS_CONNECTED: 'Redis client connected',
  REDIS_NOT_CONNECTED: 'Redis client disconnected',

  /** rabbit mq message */
  RABBITMQ_NOT_CONNECTED: 'RabbitMQ client disconnected',
  RABBITMQ_CONNECTION_CREATION: 'RabbitMQ connection creation',
  RABBITMQ_CONNECTION_ERROR: 'RabbitMQ connection error',
  RABBITMQ_CONNECTION_CLOSED: 'RabbitMQ connection closed',
  RABBITMQ_CONNECTION_ESTABLISH: 'RabbitMQ connection establish',
  RABBITMQ_CHANNEL_CREATION: 'RabbitMQ channel creation',
  RABBITMQ_CHANNEL_ERROR: 'RabbitMQ channel error',
  RABBITMQ_CHANNEL_CLOSED: 'RabbitMQ channel closed',
  RABBITMQ_CHANNEL_ESTABLISH: 'RabbitMQ channel establish',
  RABBITMQ_PUBLISH: 'RabbitMQ publishing',
  RABBITMQ_PUBLISH_OK: 'RabbitMQ succeeded publishing',
  RABBITMQ_PUBLISH_FALLBACK: 'RabbitMQ publish got fallback',
  RABBITMQ_CONSUME: 'RabbitMQ consuming',
  RABBITMQ_CONSUME_OK: 'RabbitMQ succeeded consuming',
  RABBITMQ_CONSUME_FALLBACK: 'RabbitMQ failed consuming',
  RABBITMQ_NOACK: 'RabbitMQ NOACK a message',

  /** common message */
  ERROR_REQUEST_DATA: 'Error request data',
  SYSTEM_ERROR: 'Internal system error',
  REQUEST_DATA_ERROR: 'There is a problem with the request data',
  RESPONSE_DATA_ERROR: 'There is a problem with the response data'
}

module.exports = {
  TYPE_INFO,
  TYPE_WARN,
  TYPE_ERROR,
  MESSAGE
};
