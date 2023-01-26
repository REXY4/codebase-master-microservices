module.exports = {
  path: '/$io',
  namespaces: [
    'internal',
    'public'
  ],
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origin: '*',
    // credentials: true,
  }
}
