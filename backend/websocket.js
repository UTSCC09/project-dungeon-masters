const socket = require("socket.io");
const io = socket(server);

// switch to mongoDB once working
// user stores for each room, the socket ids for a user
const users = {};

// each socket key refers to a roomID value
const socketToRoom = {};

// on is like an event listener, listening an emit event from client
// emit is pushing an event to trigger on
io.on('connection', socket => {
    socket.on("joinroom", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 8) {
                socket.emit("roomfull");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        // gets ids that are not the socketid, i think socket.id is there when room is created?
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("allusers", usersInThisRoom);
    });

    socket.on("sendingsignal", payload => {
        io.to(payload.userToSignal).emit('userjoined', { signal: payload.signal, callerID: payload.callerID , stream:payload.stream});
    });

    socket.on("returningsignal", payload => {
        io.to(payload.callerID).emit('receivingreturnedsignal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        // disconnects socket, basically remove socket id from room
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});