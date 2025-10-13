import User from "./model/userModel.js";

export const sockHandler = async (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id, isOnline: true
          },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('disconnect', async() => {
        try {
            await User.findOneAndUpdate({socketId: socket.id}, {
            socketId: null,
            isOnline: false
        })
        } catch (error) {
            console.log(error)            
        }
    })
  });
};
