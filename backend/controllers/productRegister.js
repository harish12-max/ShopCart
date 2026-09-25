import product from "../modules/productmodel.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "shopcart/products",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });

export const productregister = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let image = req.body.image;

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file.buffer);
            image = uploadedImage.secure_url;
        }

        if (
            !name ||
            !description ||
            price === undefined ||
            price === null ||
            !category ||
            !image ||
            stock === undefined ||
            stock === null
        ) {
            return res.status(400).json({ message: "All Field are Required" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "Price Should be Greater than 0" });
        }

        if (stock < 0) {
            return res.status(400).json({ message: "Invalid Stock" });
        }

        const prod = await product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({ message: "Successful", prod });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllProduct = async (req, res) => {
    try {
        const prods = await product
            .find()
            .select("name description category price image stock");

        return res.status(200).json({
            message: "Product From DB",
            count: prods.length,
            prods
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const prod = await product.findById(id);

        if (!prod) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        return res.status(200).json({ message: "Product Found", prod });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const searchProduct = async (req, res) => {
    try {
        const { search, category } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (category) {
            filter.category = category;
        }

        const prods = await product
            .find(filter)
            .select("name price description image category stock");

        return res.status(200).json({
            message: "Product Found",
            prods
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
