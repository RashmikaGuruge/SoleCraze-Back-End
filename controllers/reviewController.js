import createError from "../utils/createError.js";
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const createReview = async (req, res, next) => {
    if(req.isAdmin) return next(createError(403, "Admin can't create reviews!"));

    const review = new reviewModel({
        userId: req.userId,
        productId: req.body.productId,
        star: req.body.star,
        desc: req.body.desc
    })

    try {
        const isOrdered = await orderModel.findOne({
            userId: req.userId
        });

        if(!isOrdered) return next(createError(403, "You can not add review!"));

        const createdReview = await reviewModel.findOne({
            userId: req.userId,
            productId: req.body.productId
        });

        if(createdReview) return next(createError(403, "You are already added review!"));

        const saveReview = await review.save();

        await productModel.findByIdAndUpdate(req.body.productId, {
            $inc: { totalStars: req.body.star, starNumber: 1 },
        });
        res.status(201).send(saveReview);
    } catch (err) {
        next(err);
    }
}

export const deleteReview = async (req, res, next) => {
    const review = await reviewModel.findById(req.params.id);
    if (review.userId === req.userId || req.isAdmin){
        try {
            await reviewModel.findByIdAndDelete(req.params.id);
            res.status(200).json("Review has been deleted!"); 
        } catch (err) {
            next(err);
        }
    }else return next(createError(403, "You can not delete this review"));
    
}

export const getReviews = async (req, res, next) => {
    try {
        const reviews = await reviewModel.find({productId: req.params.productId});
        res.status(200).send(reviews);
        
    } catch (err) {
        next(err);
    }
}

export const getAllReviews = async (req, res, next) => {
    if(!req.isAdmin) return next(createError(403, "Users can't view all reviews!"));
    try {
        const reviews = await reviewModel.find();
        res.status(200).send(reviews);
        
    } catch (err) {
        next(err);
    }
}