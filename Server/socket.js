export const sockHandler = async (io) => {
    io('connection', (socket) => {
        console.log(socket.id)
    })
}