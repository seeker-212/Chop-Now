import User from "../model/userModel.js";

// Get CURRENT user controller
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User Id not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};

//This controller will get user location after orderhave been placed
export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, {
      location: {
        type: "point",
        coordinates: [lat, lon],
      },
    });

    //Checking if user Exists
    if (!user) {
      return res.status(400).json({ message: "user not found " });
    }
    return res.status(200).json({ message: "location updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Error getting user location ${error}` });
  }
};
