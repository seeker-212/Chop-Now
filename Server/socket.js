export const sockHandler = async (io) => {
    io.on('connection', (socket) => {
        console.log(socket.id)
    })
}