import socketIO from 'socket.io'
import { Server } from 'http'

/**
 * An event emission function to emit events for consumers
 * @param io socket io constructor object
 */
export const eventEmitter = (io: SocketIO.Server) => (action: string, payload: any) => {
  if (!Object.keys(payload).length) {
    io.emit(action, payload)
  }
}

export interface RoomTypes {
  roomID: [string]
}

export interface PayloadTypes {
  target: string
}

export interface IceCandidateTypes {
  target: string
  candidate: string
}

/**
 * Method which will initialise a socket connection on the server
 * @param server Http server to which the socket will connect
 */
export const init = (server: Server, rooms: any) => {
  console.log('Setting up the socket server')
  const io = new socketIO.Server(server)

  let numberOfConnectedClients: number = 0

  io.on('connection', (socket) => {
    console.log(`A clinet joined with socket id: ${socket.id}`)
    numberOfConnectedClients += 1

    // This call will done in the client and passed here when somebody joins a room ,i.e, with a roomID
    socket.on('join-room', (currentRoomID: string) => {
      if (rooms[currentRoomID]) {
        rooms[currentRoomID].push(socket.id)
      } else {
        rooms[currentRoomID] = [socket.id]
      }

      const otherUser = rooms[currentRoomID].find((id: string) => id !== socket.id)
      if (otherUser) {
        socket.emit('other-user', otherUser)
        socket.to(otherUser).emit('new-user', socket.id)
      }
    })

    // An offer is made from a client to another target client which will facilitate connection by answering to the offer
    socket.on('offer', (payload: PayloadTypes) => {
      io.to(payload.target).emit('offer', payload)
    })


    // Answer to the above offer is made by target client and the response is sent to the original client who made the offer
    socket.on('answer', (payload: PayloadTypes) => {
      io.to(payload.target).emit("answer", payload)
    })

    // Here the peers, i.e, clients share their individual candidate data to make a handshake
    socket.on('ic-candidate', (incoming: IceCandidateTypes) => {
      io.to(incoming.target).emit('ice-candidate', incoming.candidate)
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`)
      numberOfConnectedClients -= 1
    })
  })
  return io
}
