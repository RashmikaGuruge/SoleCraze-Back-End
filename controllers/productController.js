import productModel from "../models/productModel.js";
import createError from "../utils/createError.js";

export const createProduct = async (req, res, next) => {
    if(!req.isAdmin) return next(createError(403, "Users can't create products!"));

    const product = new productModel(req.body);

    try {
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        next(err);
    }
} 

export const getProducts = async (req, res, next) => {
    const query = req.query.new;

  try {
    const products = query
      ? await productModel.find().sort({ _id: -1 })
      : await productModel.find();
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
}

export const deleteProduct = async (req, res, next) => {
    if(!req.isAdmin) return next(createError(403, "Users can't delete products!"));

    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted!");
    } catch (err) {
        next(err);
    }
}

export const updateProduct = async (req, res, next) => {
    if(!req.isAdmin) return next(createError(403, "Users can't update products!"));
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            {
                $set : req.body
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
} 