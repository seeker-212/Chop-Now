import uploadToCloudinnary from "../config/cloudinary.js";
import Item from "../model/itemModel.js";
import Shop from "../model/shopModel.js";


//This controller will add item to the shop
export const addItem = async(req, res) => {
    try {
        //Getting data from the form
        const {name, category,foodType, price} = req.body
        let image;
        if (req.file) {
            image = await uploadToCloudinnary(req.file.path)
        }

        //Linking the item to the [Shop]
        const shop = await Shop.findOne({owner: req.userId})

        //Check if shop exist, if it doesn't throw in error
        if (!shop) {
            return res.status(400).json({message: "Shop not found"})
        }

        //Then if the shop is available, (create the Item and save in the db).
        const item = await Item.create({
            name, category,foodType, price, image, shop:shop._id
        })

        return res.status(201).json(item)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: `Error adding item ${error}`})
    }
}