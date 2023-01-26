/* eslint-disable no-undef */
const $ = require('jquery');
const io = require('socket.io-client');

const HOST = process.env.SVC_URL_THIS;
const PATH = '/$io';
const TYPING_TIMER_LENGTH = 400 // ms
let USER = {}
let ACTIVEROOM = {}
let RECONNECT = false

$(() => {
  const { Manager } = io
  const manager = new Manager(HOST, {
    autoConnect: false,
    path: PATH,
  })

  // Creates a new Socket for the given namespace. Only auth ({ auth: {key: "value"} }) is read from the options object.
  const socket = manager.socket('/public')

  let username; let room; let
    lastTypingTime
  let typing = false

  const $loginSection = $('#loginSection')
  const $chatSection = $('#chatSection')
  const $users = $('#users')
  const $usernameLbl = $('#usernameLbl')
  const $roomLbl = $('#roomLbl')
  const $messageInput = $('#messageInput')
  const $statusLbl = $('#statusLbl')
  const $chatContainer = $('#chatContainer')
  const $serveUserList = $('#serveUserList')
  const $serveUser = $('#serveUser')
  const $connectToggleBtn = $('#connectToggleBtn')
  const $leaveRoomBtn = $('#leaveRoomBtn')

  $connectToggleBtn.data('state', 'connect')

  const broadcastMessage = (message) => {
    $chatContainer.append(`
      <div class="message">
        <span style="font-style: italic;">${message}</span>
      </div>
    `)
  }

  const showMessage = (usrname, message) => {
    $chatContainer.append(`
      <div class="message">
        <span style="color: red">${usrname}</span>
        <span> : </span>
        <span>${message.value}</span>
      </div>
    `)
  }

  const sendMessage = () => {
    const message = $messageInput.val()
    if (message) {
      $messageInput.val('')
      showMessage('me', { value: message })

      // Tell server to execute 'NEW_MESSAGE' and send along one parameter
      socket.emit('NEW_MESSAGE', {
        room: ACTIVEROOM.name,
        message: {
          value: message,
        },
      })
    }
  }

  $connectToggleBtn.on('click', () => {
    const state = $connectToggleBtn.data('state');
    if (state === 'disconnect') {
      socket.connect()
    } else {
      socket.disconnect()
    }
  })

  $leaveRoomBtn.on('click', () => {
    socket.emit('LEAVE_ROOM', {
      room: ACTIVEROOM.name
    })
  })

  $messageInput.on('keydown', (event) => {
    console.log(event)
    if (event.which === 13) sendMessage()
  })

  $users.on('change', (e) => {
    const key = $(e.target).val()

    // note: #1 way for passing token
    const Authorization = `Bearer ${key}`
    manager.opts.extraHeaders = { Authorization }

    // note: #2 way for passing token
    manager.opts.query = { token: key }

    // note: #3 way for passing token
    socket.auth = { key }

    socket.connect()
  })

  $serveUserList.on('change', (e) => {
    room = $(e.target).val()
    socket.emit('JOIN_ROOM', { room })
  })

  $messageInput.on('input', () => {
    if (!typing) {
      typing = true
      socket.emit('TYPING', {
        room: ACTIVEROOM.name,
      })
    }
    lastTypingTime = new Date().getTime()

    setTimeout(() => {
      const typingTimer = new Date().getTime()
      const timeDiff = typingTimer - lastTypingTime
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        socket.emit('STOP_TYPING', {
          room: ACTIVEROOM.name,
        })
        typing = false
      }
    }, TYPING_TIMER_LENGTH)
  })

  socket.on('disconnect', (reason) => {
    console.info({ data: null, event: 'disconnect', reason })
    broadcastMessage('.. you have been disconnected')

    $connectToggleBtn.data('state', 'disconnect');
    $connectToggleBtn.val('make online');
  })

  socket.on('connect_error', (error) => {
    console.error({ data: null, event: 'connect_error', error: error.message })
  });

  socket.once('connect', () => {
    console.info({ data: null, event: 'connect (once)' })
    socket.emit('PROFILE')
  });

  socket.on('connect', () => {
    $connectToggleBtn.val('make offline');
    $connectToggleBtn.data('state', 'connect');

    if (RECONNECT) {
      console.info({ data: null, event: 'connect' })
      broadcastMessage('.. welcome back')
      socket.emit('REJOIN_ROOM', {
        room: ACTIVEROOM.name,
      })
    }
  })

  // Whenever the server emits 'USER_PROFILE'
  socket.on('USER_PROFILE', (data) => {
    USER = data.user
    console.info({ data, event: 'USER_PROFILE' })

    if (!data.user.roles.filter(value => ['client', 'expert'].includes(value)).length) {
      socket.emit('REFRESH_UNPICKED_USERS')
      return
    }
    socket.emit('INIT_ROOM')
  })

  // Whenever the server emits 'UNPICKED_USERS', update the chat body
  socket.on('UNPICKED_USERS', (data) => {
    console.info({ data, event: 'UNPICKED_USERS' })
    $serveUser.show()
    data.rooms.forEach((d) => {
      const { name, state, numOfUser } = d
      $serveUserList.append(`<option value="${name}">${name} (state=${state}, numOfUser=${numOfUser})</option>`)
    })
  })

  // Whenever the server emits 'UNAUTHORIZED'
  socket.on('UNAUTHORIZED', (data) => {
    USER = null
    console.info({ data, event: 'UNAUTHORIZED' })
    alert(data.message)
  })

  // Whenever the server emits 'LEAVE_FROM_ROOM', log the login message
  socket.on('LEAVE_FROM_ROOM', (data) => {
    ACTIVEROOM = null
    RECONNECT = false;

    console.info({ data, event: 'LEAVE_FROM_ROOM' })

    $chatSection.fadeOut();
    $loginSection.fadeIn();
    $roomLbl.html('??');
    $usernameLbl.html('??');
    $statusLbl.html('');
    $chatContainer.html('');
    $messageInput.focus();

    socket.disconnect();
  })

  // Whenever the server emits 'ADDED_TO_ROOM', log the login message
  socket.on('ADDED_TO_ROOM', (data) => {
    ACTIVEROOM = data.room
    RECONNECT = true;

    console.info({ data, event: 'ADDED_TO_ROOM' })

    $chatSection.fadeIn()
    $loginSection.fadeOut()
    $roomLbl.html(data.room.name)
    $usernameLbl.html(data.user.profile.name)
    $statusLbl.html('')
    $chatContainer.html('')
    $messageInput.focus()

    // Display the welcome message
    broadcastMessage('.. welcome to Socket.IO Chat')
    broadcastMessage(`.. participant count=${data.room.numOfUser}`)
  })

  // Whenever the server emits 'new message', update the chat body
  socket.on('USER_MESSAGE', (data) => {
    console.info({ data, event: 'USER_MESSAGE' })
    showMessage(data.user.profile.name || data.user.profile.uname, data.message.message)
  })

  // Whenever the server emits 'USER_JOINED', log it in the chat body
  socket.on('USER_JOINED', (data) => {
    console.info({ data, event: 'USER_JOINED' })
    broadcastMessage(`.. user "${data.user.profile.name || data.user.profile.uname}" joined`)
    broadcastMessage(`.. participant count=${data.room.numOfUser}`)
  })

  // Whenever the server emits 'USER_JOINED', log it in the chat body
  socket.on('USER_REJOINED', (data) => {
    console.info({ data, event: 'USER_REJOINED' })
    broadcastMessage(`.. user "${data.user.profile.name || data.user.profile.uname}" re-joined`)
    broadcastMessage(`.. participant count=${data.room.numOfUser}`)
  })

  // Whenever the server emits 'USER_TYPING', show the typing message
  socket.on('USER_TYPING', (data) => {
    console.info({ data, event: 'USER_TYPING' })
    $statusLbl.html(`${data.user.profile.name || data.user.profile.uname} is typing..`)
  })

  // Whenever the server emits 'USER_STOP_TYPING', kill the typing message
  socket.on('USER_STOP_TYPING', (data) => {
    console.info({ data, event: 'USER_STOP_TYPING' })
    $statusLbl.html('')
  })

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('USER_LEFT', (data) => {
    console.info({ data, event: 'USER_LEFT' })
    broadcastMessage(`.. ${data.user.profile.name || data.user.profile.uname} left`)
    broadcastMessage(`.. participant count=${data.room.numOfUser}`)
  })
})
