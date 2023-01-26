const hasCallback = (callback) => (typeof callback === 'function');

const getSocketsInRoom = (name, socket) => {
  const { rooms } = socket.adapter;
  const setsOfJoinedUsers = rooms.get(name) || new Set();
  const joinedUsers = Array.from(setsOfJoinedUsers);

  return joinedUsers.filter(id => id !== socket.id);
}

const newError = function (message, code) {
  const error = new Error(message);
  if (code) error.code = code
  return error
}

const fallBack = (callback, error) => {
  if (hasCallback(callback)) {
    return callback({
      code: error.code,
      error: error.message
    });
  }
  return false
}

const getRoom = async (redisConnection, room) => {
  const roomData = await redisConnection.get(room);
  const error = newError('Room doesn\'t exist', 'ERR000')

  if (!roomData) throw error;
  try {
    const parsed = JSON.parse(roomData);
    if (!Object.keys(parsed).length) {
      console.error(error)
      throw error;
    }
    return parsed;
  } catch (e) {
    console.error(error)
    throw error;
  }
}

const setRoom = async (redisConnection, room, data = {}) => {
  await redisConnection.set(room, JSON.stringify(data));
  return data;
}

module.exports = {
  hasCallback,
  getSocketsInRoom,
  newError,
  fallBack,
  getRoom,
  setRoom
};
