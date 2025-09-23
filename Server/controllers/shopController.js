import uploadToCloudinnary from "../config/cloudinary.js";
import Shop from "../model/shopModel.js";

//Creating and Editing Shop [CONTROLLER]
export const createEditShop = async (req, res) => {
    try {
        // getting data from the form body
        const {name, city, state, address} = req.body
        let image;
        if (req.file) {
            image = await uploadToCloudinnary(req.file.path)
        }

        //First find if shop exists [if it doesn't then create new shop]
        let shop = await Shop.findOne({owner: req.userId})
        if (!shop) {
            shop = await Shop.create({
            name, city, state, address, image, owner: req.userId
        })
        // This will update the shop if needed
        }else {
            shop = await Shop.findByIdAndUpdate({
                name, city, state, address, image, owner: req.userId
            }, {new: true})
        }

        //Populate the owner
        await shop.populate("owner")
        return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({message: `Error creating shop ${error}`})
    }
}
