import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { validationResult } from 'express-validator'; 

export const createCart = async (req, res, next) => {
  const { userId, products } = req.body;

  // Initialize an array to store error messages
  const errors = [];

  // Check if the user has an existing cart
  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    // Create a new cart if the user doesn't have one
    cart = new cartModel({ userId, products: [] });
  }

  // Iterate through products and handle errors
  for (const product of products) {
    try {
      // Query the database for the product with the given ID
      const foundProduct = await productModel.findById(product.productId);

      if (!foundProduct) {
        errors.push(`Product not found for productId: ${product.productId}`);
      } else {
        // Check if the product is already in the cart
        const existingProduct = cart.products.find((p) => p.productId.equals(product.productId));

        if (existingProduct) {
          // Update quantity if the product is already in the cart
          existingProduct.quantity += product.quantity;
        } else {
          // Add the product to the cart
          cart.products.push({
            productId: product.productId,
            quantity: product.quantity,
            size: product.size,
            price: product.price
          });
        }
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      console.error('Error querying product or updating cart:', error);
      errors.push(`Error processing product: ${error.message}`);
    }
  }

  // Check if there are errors
  if (errors.length > 0) {
    return res.status(404).json({ message: errors.join(', ') });
  }

  // Continue with the rest of your logic or respond with the updated cart
  const savedCart = await cart.save();
  res.status(200).json(savedCart);
};


export const updateCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    const updatedCart = await cartModel.findOneAndUpdate(
      {
        userId: req.params.userId,
        'products.productId': productId,
      },
      {
        $set: {
          'products.$.quantity': quantity,
        },
      },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ error: 'Cart or product not found' });
    }

    res.status(200).json(updatedCart);
  } catch (err) {
    next(err);
  }
};


  
export const deleteCart = async (req, res, next) => {
    try {
      await cartModel.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted...");
    } catch (err) {
      next(err);
    }
};
  
export const getCart = async (req, res, next) => {
    try {
      const cart = await cartModel.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      next(err);
    }
};

export const removeProductFromCart = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Find the user's cart
    const userCart = await cartModel.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ message: 'User cart not found' });
    }

    // Use $pull to remove the product with the specified productId
    userCart.products.pull({ productId });

    // Save the updated cart
    const updatedCart = await userCart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

