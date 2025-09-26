import uploadToCloudinnary from "../config/cloudinary.js";
import Shop from "../model/shopModel.js";

//Creating and Editing Shop [CONTROLLER]
export const createEditShop = async (req, res) => {
  try {

    // getting data from the form body
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
      try {
        image = await uploadToCloudinnary(req.file.path);
      } catch (error) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    //First find if shop exists [if it doesn't then create new shop]
    let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
      // This will update the shop if needed
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { $set: { name, city, state, address, image } },
        { new: true }
      );
    }

    //Populate the owner
    await shop.populate("owner items");
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Error creating shop ${error}` });
  }
};

// This will get logged in owners shop
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate("items")

    //check if shop is available
    if (!shop) {
      return res.status(404).json({ message: "No shop found" });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Finding shop error ${error}` });
  }
};
